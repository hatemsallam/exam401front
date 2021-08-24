import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { withAuth0 } from '@auth0/auth0-react';
import { Card, Button , Modal , Form } from 'react-bootstrap'



class FavFlowers extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      favFlowers: [],
      index: -1,
      name: '',
      photo: '',
      instructions: '',
      showModal: false,
      flowerObj: {}
    }
  }

  componentDidMount() {
    const { user } = this.props.auth0
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/favFlowers`, { params: { userEmail: user.email } })
      .then(result => {
        this.setState({
          favFlowers: result.data
        })
      })
  }


  deleteFlower = (idx) => {

    const { user } = this.props.auth0
    axios
      .delete(`${process.env.REACT_APP_SERVER_URL}/deleteFlower/${idx}`, { params: { userEmail: user.email } })
      .then(result => {
        this.setState({
          favFlowers: result.data
        })
      })
  }

  updateFlower = (flower, idx) => {
    this.setState({
      index: idx,
      name: flower.name,
      photo: flower.photo,
      instructions: flower.instructions,
      showModal: true,
      flowerObj: flower
    })
  }



  closeModal = () => {
    this.setState({
      showModal: false
    })
  }

  submitHandler = (event) => {
    event.preventDefault();
    const { user } = this.props.auth0
    const newName = event.target.flowerName.value
    const newImg = event.target.flowerImg.value
    const newInstructions = event.target.flowerInstructions.value

    const newFlowerObj = {
      instructions: newInstructions,
      photo: newImg,
      name: newName
    }
    const params = {
      userEmail: user.email,
      flowerObj: newFlowerObj
    }
    axios.put(`${process.env.REACT_APP_SERVER_URL}/updateFlower/${this.state.index}`, params)
      .then(result => {
        this.setState({
          favFlowers: result.data
        })
      })

  }





  render() {
    return (
      <>
        <h1>My Favorite Flowers</h1>
        {this.state.favFlowers.length && this.state.favFlowers.map((flower, idx) => {
          return (
            <>
              <Card style={{ width: '18rem', display: 'inline-block' }}>
                <Card.Img variant="top" src={flower.photo} />
                <Card.Body>
                  <Card.Title>{flower.name}</Card.Title>
                  <Card.Text>
                    {flower.instructions}
                  </Card.Text>
                  <Button onClick={() => { this.deleteFlower(idx) }} variant="primary">delete</Button>
                  <Button onClick={() => { this.updateFlower(flower, idx) }} variant="primary">update</Button>
                </Card.Body>
              </Card>
              {this.state.showModal &&
                <Modal show={this.state.showModal} onHide={this.closeModal}>
                  <Modal.Header closeButton>
                    <Modal.Title>Update Form</Modal.Title>
                  </Modal.Header>
                  <Modal.Body><Form onSubmit={this.submitHandler}>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                      <Form.Label>update Name</Form.Label>
                      <Form.Control type="text" name='flowerName' defaultvalue={this.state.flowerObj.name} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                      <Form.Label>Update Image</Form.Label>
                      <Form.Control type="text" name='flowerImg' defaultvalue={this.state.flowerObj.photo} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                      <Form.Label>Update Instructions</Form.Label>
                      <Form.Control type="text" name='flowerInstructions' defaultvalue={this.state.flowerObj.instructions} />
                    </Form.Group>
                    <Button variant="primary" type='submit'>
                      update
                    </Button>
                  </Form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={this.closeModal}>
                      Close
                    </Button>

                  </Modal.Footer>
                </Modal>
              }
            </>
          )
        })

        }
      </>
    )
  }
}

export default withAuth0(FavFlowers);
