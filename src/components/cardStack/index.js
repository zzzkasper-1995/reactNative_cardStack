import React, { Component } from 'react';
 
import { StyleSheet, View } from 'react-native';

import SwipeableCard from './swipeableCard'
import testData from './testData'

// количество отображаемых карточек
const STACK_LENGTH = 4;

export default class App extends Component {
  constructor() {
    super();
    this.state = {
        cardArray: testData,
    };
  }
 
  removeCard = id => {
    const lastCard = this.state.cardArray.splice(
        this.state.cardArray.findIndex(x => x.id == id), 1
      )[0];
   
      this.setState({ cardArray: this.state.cardArray});
      this.setState({ cardArray: [lastCard, ...this.state.cardArray]});
  };

  addCard = (id) => {
    const index = this.state.cardArray.findIndex(x => x.id == id);

    const lastCard = this.state.cardArray.splice( index, 1 )[0];
    const firstCard = this.state.cardArray.splice(0, 1)[0];
   
    this.setState({ cardArray: [...this.state.cardArray, firstCard]});
    this.setState({ cardArray: [lastCard, ...this.state.cardArray]});
  };
 
  showCard = (cardArray) => {
      const betweenLength = cardArray.length - STACK_LENGTH;
      return cardArray.slice(betweenLength, betweenLength + STACK_LENGTH).map((item, index) => {
        return (
            <SwipeableCard
                key={item.id}
                item={item}
                removeCard={this.removeCard.bind(this, item.id)}
                addCard={this.addCard.bind(this, item.id)}
                index = {STACK_LENGTH - index} 
                maxIndex={STACK_LENGTH}
            />)
      })
  }

  render() {
    const {cardArray} = this.state;

    return (
        <View style={styles.mainContainer}>
            {this.showCard(cardArray)}
        </View>
    );
  }
}
 
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 24,
  },
  cardStyle: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    color: '#fff',
    fontSize: 24,
  },
});
