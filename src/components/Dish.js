import React from 'react';
import EditButton from './EditButton';

class DishName extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      name: this.props.name
    }

    this.handleChange = this.handleChange.bind(this);
  }
  
  handleChange(event) {
    this.setState({name: event.target.value});
    this.props.updateDishName(event.target.value);
  }

  render() {
    return (
      <input
        type='text'
        name='dishName'
        placeholder='E.g.: "Tuna and pasta salad"'
        value={this.state.name}
        onChange={this.handleChange.bind(null)}
      />
    );
  }
}

class AddIngredient extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      value: this.props.value ? this.props.value : '',
      test: [{ndbno: 'result1'}, {ndbno: 'result2'}]
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleResults = this.handleResults.bind(this);
  }
  
  handleChange(event) {
    // Get input value
    const inputValue = event.target.value;
    
    // Update state.value
    this.setState({value: inputValue});

    // If there is anything written in the input, show suggestion
    // tray. Otherwise, close suggestion tray
    const searchLength = inputValue.length;
    if (searchLength > 0) {
      // Get data from NDBno
      this.props.getIngredientNdbno(
        this.props.privateData.apiKey,  // API key
        inputValue,                     // Value to search
        this.handleResults              // Function to handle search results
      );
    }    
  }

  handleSubmit(event) {
    // Pass the name of the ingredient (this.state.value) to <Dish />
    // to be added as a new ingredient
    this.props.handleAddIngredientSubmit(this.state.value)
    
    // Reset input value
    this.setState({value: ''})

    // Prevent page from reloading
    event.preventDefault();
  }

  // Store results within <AddIngredient /> state
  handleResults(results){
    this.setState({ results: results });
  }

  render() {
    return (
      <div className='addIngredient'>
        <form 
          onSubmit={this.handleSubmit}
        >
          <input
            type='text'
            id='ingredientInput'
            list='ingredientResultList'
            placeholder='Add ingredient!'
            value={this.state.value}
            onChange={this.handleChange.bind(null)}
          />
          <datalist id='ingredientResultList' onChange={this._onChange}>
            <select>
              {
                this.state.results
                ? this.state.results.map((result,i)=>{
                    const value = result.ndbno + ' - ' + result.name + '(' + result.group + ')';
                    const id=result.ndbno;
                    return <option id={id} value={value} key={i}/>
                  })
                : null
              }
            </select>
          </datalist>
        </form>
      </div>
    );
  }
}

class DishIngredient extends React.Component {
  render() {
    const ingredient = this.props.ingredient;
    const ingredientKeys = Object.keys(ingredient);
    return (
      <li className='dishIngredientRow' key={this.props.i}>
        {ingredientKeys.map((ingredientKey, i)=>{
          return(
            <div className={'ingredient' + ingredientKey} key={i}>
              {ingredientKey}: {ingredient[ingredientKey]}
            </div>
          );
        })}
      </li>
    );
  }
}

class Dish extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      name: this.props.dish.name,     // string with dish name
      recipe: this.props.dish.recipe, // array with ingredients
      editionModeOn: false,
    }

    this.updateDishName = this.updateDishName.bind(this);
    this.changeEditionMode = this.changeEditionMode.bind(this);
    this.handleAddIngredientSubmit = this.handleAddIngredientSubmit.bind(this);
  }

  updateDishName(name){
    this.setState({name: name});
  }
  
  changeEditionMode(event) {
    // Change edition mode state property
    if (this.state.editionModeOn === true) {
      this.setState({editionModeOn: false});
    } else {
      this.setState({editionModeOn: true});
    }
  }

  // Recieve new ingredient name from child <AddIngredient /> and pass all the necessary
  // information to <App /> to update <App /> state to add the new ingredient
  handleAddIngredientSubmit(newIngredientName){
    console.log('handleAddIngredientSubmit ' + newIngredientName + '!')
    this.props.addIngredient(
      this.props.week,          // week name
      this.props.day,           // day name
      this.props.meal,          // meal name
      this.state.name,          // dish name
      {                         // new ingredient object:
        name: newIngredientName //  - ingredient name
        // TODO ADD HERE MISSING INGREDIENT NUTRITIONAL VALUES
      }
    );
    // Do not use here event.preventDefault() !!
  }

  render(){
    const dish = this.props.dish;
    if (
      typeof(dish) === 'object'
      && dish.name
      && dish.recipe
      && typeof(dish.name) === 'string'
      && Array.isArray(dish.recipe) === true
      // && dish.recipe.length > 0
    ) {
      return (
        <div className='dish'>
          <div className='dishTopMenu'>
            <DishName name={dish.name} updateDishName={this.updateDishName} />
            <EditButton
              changeEditionMode={this.changeEditionMode}
            />
          </div>
          {
            this.state.editionModeOn === true
            ? <AddIngredient
                handleAddIngredientSubmit={this.handleAddIngredientSubmit}
                getIngredientNdbno={this.props.getIngredientNdbno}
                privateData={this.props.privateData}
              />
            : null
          }
          {
            this.state.editionModeOn === true
            ? <div className='dishIngredientList'>
                <ul>
                  {this.state.recipe.map((ingredient,i)=>{
                    return <DishIngredient ingredient={ingredient} key={i} />
                  })}
                </ul>
              </div>
            : null
          }
        </div>
      )
    } else {
      return(
        <div>
          <h5>{dish.name}</h5>
          <p>There is no info in this dish!</p>
        </div>
      )
    }
    
  }
}

module.exports = Dish;