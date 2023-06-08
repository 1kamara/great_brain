
import { Component } from 'react';
import ParticlesBg from 'particles-bg';
import Navigation from './Components/Navigation/Navigation';
import SignIn from './Components/SignIn/SignIn';
import Register from './Components/Register/Register';
import Logo from './Components/Logo/Logo';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Rank from './Components/Rank/Rank';
import FaceDetection from './Components/FaceDetection/FaceDetection';
import 'tachyons';
import './App.css';

const setUpClarfi = (imageUrl)=>{
   // Your PAT (Personal Access Token) can be found in the portal under Authentification
   const PAT = '99c15a18fe6d43a19182b19e7b92bbaa';
   // Specify the correct user_id/app_id pairings
   // Since you're making inferences outside your app's scope
   const USER_ID = 'kamara';       
   const APP_ID = 'test1';
   // Change these to whatever model and image URL you want to use
  //  const MODEL_ID = 'face-detection';   
   const IMAGE_URL = imageUrl;

   ///////////////////////////////////////////////////////////////////////////////////
   // YOU DO NOT NEED TO CHANGE ANYTHING BELOW THIS LINE TO RUN THIS EXAMPLE
   ///////////////////////////////////////////////////////////////////////////////////

   const raw = JSON.stringify({
       "user_app_id": {
           "user_id": USER_ID,
           "app_id": APP_ID
       },
       "inputs": [
           {
               "data": {
                   "image": {
                       "url": IMAGE_URL
                   }
               }
           }
       ]
   });

   const requestOptions = {
       method: 'POST',
       headers: {
           'Accept': 'application/json',
           'Authorization': 'Key ' + PAT
       },
       body: raw
   };
   return requestOptions;
}

   
   

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'sigin',
      isSignedIn: false,
        user: {
              id: '',
              name: '',
              email: '',
              entries: 0,
              joined: '',
            }
  } 
}

userLoad = (data) => {
  this.setState({user: {
              id: data.id,
              name: data.name,
              email: data.email,
              entries: data.entries,
              joined: data.joined,

  }})
}

// componentDidMount() {
//   fetch('http://localhost:3000/')
//   .then(response => response.json())
//     .then(console.log)
// }

faceCalculation = (data) => {
  const faceClarifai = data.outputs[0].data.regions[0].region_info.bounding_box;
  const image = document.getElementById('inputimage');
  const width = Number(image.width);
  const height = Number(image.height);
  return {
    leftCol: faceClarifai.left_col * width,
    topRow: faceClarifai.top_row * height,
    rightCol: width - (faceClarifai.right_col * width),
    bottomRow: height - (faceClarifai.bottom_row * height),
  }
}

displayBoxFace = (box) => {
  this.setState({box: box});
}

onInputChange = (event) =>{
  this.setState({input: event.target.value});

}
onSubmitButton =() => {
  this.setState({imageUrl: this.state.input})
  // console.log('click');
   // NOTE: MODEL_VERSION_ID is optional, you can also call prediction with the MODEL_ID only
    // https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
    // this will default to the latest version_id

    fetch("https://api.clarifai.com/v2/models/face-detection/outputs", setUpClarfi(this.state.input))
        .then(response => response.json())
        .then((response) => {
          if (response) {
            fetch('https://frontendapp-vo2y.onrender.com/image',{
              method: 'put',
              headers: {'Content-Type': 'application/json'},
             body: JSON.stringify({
             id: this.state.user.id
            })
            })
            .then(response => response.json())
             .then(count => {
               this.setState(Object.assign(this.state.user, { entries: count}))
             }).catch(console.log)

          }
          this.displayBoxFace(this.faceCalculation(response))
        })
          .catch(err => console.log(err));
}

onRouteChange = (route) => {
  if (route === 'signout') {
    this.setState({isSignedIn: false})
  }else if (route === 'home'){
    this.setState({isSignedIn: true})
  }
  this.setState({route: route});
}

  render () {
    const { isSignedIn, imageUrl, route, box } = this.state;
  return (
    <div className="app">
       <div>
        <ParticlesBg className='particles' color="#ff0000" num={10} type="ribbons" bg={true} />
        </div>
      <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
      {route === 'home' ?
      <div>
      <Logo />
      <Rank
      name={this.state.user.name}
      entries={this.state.user.entries} 
      />
      < ImageLinkForm onInputChange={this.onInputChange} onSubmitButton={this.onSubmitButton}/>
      <FaceDetection box={box} imageUrl={imageUrl}/>
      </div>
      :(
        route === 'signin' ?
        <SignIn userLoad ={this.userLoad} onRouteChange={this.onRouteChange}/>:
        <Register userLoad={this.userLoad} onRouteChange={this.onRouteChange}/>
      )
    }
    </div>
  );
}
}

export default App;
