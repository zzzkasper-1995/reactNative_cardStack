import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';

import CardStack from './components/cardStack'

export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <CardStack />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
