import React from 'react';
import Hero from '../../layouts/Hero';
import { Input, Button, Form } from '../../form/Form';
import Map from '../../map/Map';
import { Link } from 'react-router-dom';

class AreasManage extends React.Component {

  onSubmit(e) {
    e.preventDefault();
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
            onPolygonComplete={(featureGroup) => {}}
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
                name="area"
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
