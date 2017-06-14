import React from 'react';
import Hero from '../../layouts/Hero';
import { Input, Button, Form } from '../../form/Form';
import Map from '../../map/Map';
import { Link } from 'react-router-dom';
import { validation } from '../../../helpers/validation'; // eslint-disable-line no-unused-vars
import { toastr } from 'react-redux-toastr';
import Icon from '../../ui/Icon';

class AreasManage extends React.Component {

  constructor() {
    super();
    this.form = {};

    this.onSubmit = this.onSubmit.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    if (this.form.area) {
      toastr.success('Area saved', 'Note: in dev mode, area not saved to API');
    } else {
      toastr.error('Area needed', 'You cannot save without drawing an area');
    }
  }

  onInputChange(e) {
    this.form[e.target.name] = e.target.value;
  }

  render() {
    return (
      <div>
        <Hero
          title="Create an Area of Interest"
        />
        <Form onSubmit={this.onSubmit}>
          <Map
            editable={true}
            onDrawComplete={(areaGeoJSON) => { this.form.area = areaGeoJSON }}
          />
          <div className="row columns">
            <div className="c-form">
              <Link to="/areas">
                <button className="c-button -light">Cancel</button>
              </Link>
              <div className="upload-field">
                <Icon name="icon-download" className="-medium" />
                <span className="text">Upload an Area</span>
              </div>
              <span className="separator -vertical"></span>
              <div className="horizontal-field">
                <label className="text -x-small-title">Name the Area: </label>
                <Input
                  type="text"
                  onChange={this.onInputChange}
                  name="name"
                  value=""
                  placeholder=""
                  validations={['required']}
                  />
              </div>
              <Button className="c-button">Save</Button>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

export default AreasManage;
