import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { withAuth0 } from '@auth0/auth0-react';
import { Card, Button } from 'react-bootstrap'


class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      allFlowers: []
    }
  }

  componentDidMount() {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/allFlowers`)
      .then(result => {
        this.setState({
          allFlowers: result.data
        })
      })
  }

  addFlower = (flowerObj) => {
    const { user } = this.props.auth0
    const params = {
      userEmail: user.email,
      flowerObj: flowerObj
    }
    axios
    .post(`${process.env.REACT_APP_SERVER_URL}/addFlower`,params)
    .catch(err => {
      console.log(err)
    })
  }



  render() {
    return (
      <>
        <h1>API Flowers</h1>
        {this.state.allFlowers.length && this.state.allFlowers.map((flower, idx) => {
          return (
            <>
              <Card style={{ width: '18rem', display: 'inline-block' }}>
                <Card.Img variant="top" src={flower.photo} />
                <Card.Body>
                  <Card.Title>{flower.name}</Card.Title>
                  <Card.Text>
                    {flower.instructions}
                  </Card.Text>
                  <Button onClick={() => { this.addFlower(flower) }} variant="primary">Add to Favorite</Button>
                </Card.Body>
              </Card>
            </>
          )
        })

        }
      </>
    )
  }
}

export default withAuth0(Home);
