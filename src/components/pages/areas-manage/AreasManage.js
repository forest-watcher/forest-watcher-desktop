import React from 'react';
import Hero from '../../layouts/Hero';
import { Input, Button, Form } from '../../form/Form';
import Map from '../../map/Map';
import { Link } from 'react-router-dom';
import { validation } from '../../../helpers/validation';

class AreasManage extends React.Component {

  constructor(props) {
    super(props);
    this.form = {};

    this.onSubmit = this.onSubmit.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    if (this.form.area) {
      console.log(this.form);
    } else {
      console.log('Draw an area');
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
              <Input
                type="text"
                label="Name the area"
                onChange={this.onInputChange}
                name="name"
                value=""
                placeholder=""
                validations={['required']}
              />
              <Button className="c-button">Save</Button>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

export default AreasManage;
