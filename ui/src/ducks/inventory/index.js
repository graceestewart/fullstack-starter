import axios from 'axios'
import { createAction, handleActions } from 'redux-actions'

const actions = {
  INVENTORY_GET_ALL: 'inventory/get_all',
  INVENTORY_REFRESH: 'inventory/refresh',
  INVENTORY_DELETE: 'inventory/delete',
  INVENTORY_SAVE: 'inventory/save', // unsure if this should be create instead of save
  INVENTORY_GET_ALL_PENDING: 'inventory/get_all_PENDING'
  // not sure if I want this like in product or if it should just be pending
}

export let defaultState = {
  all: []
}

export const findInventory = createAction(actions.INVENTORY_GET_ALL, () =>
  (dispatch, getState, config) => axios
    .get(`${config.restAPIUrl}/inventory`)
    .then((suc) => dispatch(refreshInventory(suc.data)))
)

export const removeInventory = createAction(actions.INVENTORY_DELETE, (ids) =>
  (dispatch, getState, config) => axios
    .delete(`${config.restAPIUrl}/inventory`, { data: ids })
    .then((suc) => {
      const invs = [] // i hope this isn't product specific (like products are in inventory)
      getState().inventory.all.forEach(inv => { // no duplicates!
        if (!ids.includes(inv.id)) {
          invs.push(inv)
        }
      })
      dispatch(refreshInventory(invs))
    })
)

export const saveInventory = createAction(actions.INVENTORY_SAVE, (inventory) =>
  (dispatch, getState, config) => axios
    .post(`${config.restAPIUrl}/inventory`, inventory)
    .then((suc) => {
      const invs = []
      getState().inventory.all.forEach(inv => {
        // add everything except for the one (why is this not switched with the one in delete?)
        if (inv.id !== suc.data.id) {
          invs.push(inv)
        }
      })
      invs.push(suc.data) // add the one last
      dispatch(refreshInventory(invs))
    })
)

// alphabetizing the inventory!
export const refreshInventory = createAction(actions.INVENTORY_REFRESH, (payload) =>
  (dispatcher, getState, config) =>
    payload.sort((inventoryA, inventoryB) => inventoryA.name < inventoryB.name ? -1 : inventoryA.name > inventoryB.name ? 1 : 0)
    // given A,B -> if Aname<Bname, return -1. if Aname>Bname, return 1. else 0.
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
