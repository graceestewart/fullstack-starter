import axios from 'axios'
import { createAction, handleActions } from 'redux-actions'

const actions = {
  INVENTORY_GET_ALL: 'inventory/get_all',
  INVENTORY_REFRESH: 'inventory/refresh',
  INVENTORY_UPDATE: 'inventory/update',
  INVENTORY_DELETE: 'inventory/delete',
  INVENTORY_CREATE: 'inventory/create',
  INVENTORY_GET_ALL_PENDING: 'inventory/get_all_PENDING'
}

export let defaultState = {
  all: [],
  fetched: false,
}

export const findInventory = createAction(actions.INVENTORY_GET_ALL, () =>
  (dispatch, getState, config) => axios
    .get(`${config.restAPIUrl}/inventory`)
    .then((suc) => dispatch(refreshInventory(suc.data)))
)

export const removeInventory = createAction(actions.INVENTORY_DELETE, (ids) =>
  (dispatch, getState, config) => axios
    .delete(`${config.restAPIUrl}/inventory`, { data : ids })
    .then((suc) => {
      const invs = []
      getState().inventory.all.forEach(inv => {
        if (!ids.includes(inv.id) && inv.id != suc.id) {
          invs.push(inv)
        }
      })
      dispatch(refreshInventory(invs))
    })
)

export const createInventory = createAction(actions.INVENTORY_CREATE, (inventory) =>
  (dispatch, getState, config) => axios
    .post(`${config.restAPIUrl}/inventory`, inventory)
    .then((suc) => {
      const invs = []
      getState().inventory.all.forEach(inv => {
        if (inv.id !== suc.data.id) {
          invs.push(inv)
        }
      })
      invs.push(suc.data)
      dispatch(refreshInventory(invs))
    })
    .catch(function(error) {
      console.log(error.response)
      return Promise.reject(error)
    })
)

export const updateInventory = createAction(actions.INVENTORY_UPDATE, (inventory) =>
  (dispatch, getState, config) => axios
    .put(`${config.restAPIUrl}/inventory`, inventory)
    .then((suc) => {
      const invs = []
      getState().inventory.all.forEach(inv => {
        if (inv.id !== suc.data.id) {
          invs.push(inv)
        }
      })
      invs.push(suc.data)
      dispatch(refreshInventory(invs))
    })
    .catch(function(error) {
      console.log(error.response)
      return Promise.reject(error)
    })
)

export const refreshInventory = createAction(actions.INVENTORY_REFRESH, (payload) =>
  (dispatcher, getState, config) =>
    payload.sort((inventoryA, inventoryB) => inventoryA.name < inventoryB.name ? -1 : inventoryA.name > inventoryB.name ? 1 : 0)
)

export default handleActions({
  [actions.INVENTORY_GET_ALL_PENDING]: (state) => ({
    ...state,
    fetched: false
  }),
  [actions.INVENTORY_REFRESH]: (state, action) => ({
    ...state,
    all: action.payload,
    fetched: true
  })
}, defaultState)
