import * as yup from 'yup'
import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { findProducts } from '../../ducks/products'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import Grid from '@material-ui/core/Grid'
import { MeasurementUnits } from '../../constants/units'
import { MenuItem } from '@material-ui/core'
import moment from 'moment'
import React from 'react'
import { Select } from '@material-ui/core'
import { TextField } from '@material-ui/core'
import { ErrorMessage, Field, Form, Formik } from 'formik'

const submitSchema = yup.object({
  name: yup
    .string('its not a string')
    .required('Required'),
  productType: yup.string('its not a string')
    .min(1, 'Required')
    .required('Required'),
  unitOfMeasurement: yup.string('its not a string')
    .min(1, 'Required')
    .required('Required'),
})

class InventoryFormModal extends React.Component {
  render() {
    const {
      formName,
      getProducts,
      handleDialog,
      handleInventory,
      title,
      initialValues,
      value
    } = this.props

    const products = {getProducts}.getProducts
    const date = moment(new Date()).format('YYYY-MM-DD')
    const units = { MeasurementUnits }
    return (
      <Dialog
        open={this.props.isDialogOpen}
        maxWidth='sm'
        fullWidth={true}
        onClose={() => { handleDialog(false) }}
      >
        <Formik
          initialValues={initialValues}
          validationSchema={submitSchema}
          onSubmit={values => {
            if (values.neverExpires == true){
              values.bestBeforeDate = initialValues.bestBeforeDate
            }
            values.bestBeforeDate = new Date(Date.parse(values.bestBeforeDate+'Z'))
            values.bestBeforeDate.setDate(values.bestBeforeDate.getDate()+1)
            handleInventory(values)
            handleDialog(true)
          }}>
          {props =>
            <Form
              noValidate
              autoComplete='off'
              id={formName}
            >
              <DialogTitle id='alert-dialog-title'>
                {`${title} Inventory`}
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <label style={{ fontSize: 13 }}>* indicates a required field</label>
                  </Grid>
                  <Grid item xs={12}>
                    <label  style={{ fontSize: 16 }}>Name* :  </label>
                    <TextField
                      custom={{ variant: 'outlined', fullWidth: true, }} // the box that pops up askng for name
                      name='name'
                      defaultValue={initialValues.name}
                      onChange={props.handleChange}
                      fullWidth={true}
                    />
                    {props.errors.productType && props.touched.productType ?
                      <div>{props.errors.productType}</div>
                      : null}
                  </Grid>
                  <Grid item xs={12}>
                    <label  style={{ fontSize: 16 }}>Product Type* :  </label>
                    <Select
                      value={value}
                      name='productType'
                      onChange={props.handleChange}
                      fullWidth={true}
                      defaultValue={initialValues.productType}
                    >
                      {products.map((prod) => <MenuItem key={prod.id} value={prod.name}>{prod.name}</MenuItem>)}
                    </Select>
                    {props.errors.productType && props.touched.productType ?
                      <div>{props.errors.productType}</div>
                      : null}
                  </Grid>
                  <Grid item xs={12}>
                    <label  style={{ fontSize: 16 }}>Description (Optional) :  </label>
                    <TextField // this is goihg to try to be description?
                      custom={{ variant: 'outlined', fullWidth: true, }}
                      name='description'
                      defaultValue={initialValues.description}
                      onChange={props.handleChange}
                      fullWidth={true}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <label  style={{ fontSize: 16 }}>Average Price (Optional) :  </label>
                    <TextField
                      type='number'
                      custom={{ variant: 'outlined', fullWidth: true, }}
                      name='averagePrice'
                      defaultValue={initialValues.averagePrice}
                      onChange={props.handleChange}
                      fullWidth={true}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <label  style={{ fontSize: 16 }}>Amount (Optional) :  </label>
                    <TextField
                      type='number'
                      custom={{ variant: 'outlined', fullWidth: true, }}
                      name='amount'
                      defaultValue={initialValues.amount}
                      onChange={props.handleChange}
                      fullWidth={true}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <label style={{ fontSize: 16 }}>Unit of Measurement* :  </label>
                    <Select
                      defaultValue={initialValues.unitOfMeasurement}
                      value={value}
                      name='unitOfMeasurement'
                      onChange={props.handleChange}
                      fullWidth={true}
                    >
                      {Object.entries(units.MeasurementUnits).map(([key,val]) => <MenuItem key={key} value={key}>{val.name}</MenuItem>)}
                    </Select>
                    {props.errors.unitOfMeasurement && props.touched.unitOfMeasurement ?
                      <div>{props.errors.unitOfMeasurement}</div>
                      : null}
                  </Grid>
                  <Grid item xs={12}>
                    <label style={{ fontSize: 16 }}>Best Before Date:  </label>
                    <TextField
                      type='date'
                      defaultValue={moment(initialValues.bestBeforeDate).format('YYYY-MM-DD')}
                      inputProps={{ min: date, max: '2100-01-01' }}
                      disabled={this.pressed} // this does NOT work
                      onChange={props.handleChange}
                      fullWidth={true}
                      name='bestBeforeDate'
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormGroup>
                      <FormControlLabel control={<Checkbox defaultChecked={initialValues.neverExpires}/>} name='neverExpires' defaultValue={initialValues.neverExpires} onChange={props.handleChange} label='No Best Before Date' />
                    </FormGroup>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => { handleDialog(false) }} color='secondary'>Cancel</Button>
                <Button
                  variant='contained'
                  type='submit'
                  form={formName}
                  color='secondary'
                >
                  Save
                </Button>
              </DialogActions>
            </Form>
          }
        </Formik>
      </Dialog>
    )
  }
}

export default InventoryFormModal