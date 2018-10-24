import React, { Component } from 'react';
 
import { Platform, StyleSheet, View, Text, 
        Dimensions, Animated, PanResponder,} from 'react-native';
 
const SCREEN_WIDTH = Dimensions.get('window').width;

const SPEED_ANIMATED = 600;

export default class SwipeableCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
        Xposition: new Animated.Value(0),
        Yposition: new Animated.Value(props.index*(-10))
    };
    this.panResponder;
    this.cardOpacity = new Animated.Value(0);
    this.cardSize = new Animated.Value(170);
  }
 
  componentWillMount() {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderMove: (evt, gestureState) => {
        this.state.Xposition.setValue(gestureState.dx);
      },
 
      onPanResponderRelease: (evt, gestureState) => {
        if (
          gestureState.dx < SCREEN_WIDTH - 150 &&
          gestureState.dx > -SCREEN_WIDTH + 150
        ) {
          Animated.spring(
            this.state.Xposition,
            {
              toValue: 0,
              speed: 5,
              bounciness: 10,
            },
            { useNativeDriver: true }
          ).start();
        } else if (gestureState.dx > SCREEN_WIDTH - 150) {
          this.animatedSwipe(SCREEN_WIDTH, this.props.removeCard);
        } else if (gestureState.dx < -SCREEN_WIDTH + 150) {
          this.animatedSwipe(-SCREEN_WIDTH, this.props.addCard);
        }
      },
    });
   
    console.log('hi', this.props.maxIndex, this.props.index)
    if(this.props.maxIndex === this.props.index) {
        console.log('if', this.props.item.id, this.props.index)
        this.animatedAdd(this.props.index) 
    } else {
        console.log('else', this.props.item.id, this.props.index)
        this.animatedRemove(this.props.index) 
    }  
  }

  componentWillUpdate(nextProps, nextState) {
      if(nextProps.index !== this.props.index) {
          this.animatedAdd(nextProps.index)     
      }
  }
 

  render() {
    const {item} = this.props;

    const rotateCard = this.state.Xposition.interpolate({
      inputRange: [-200, 0, 200],
      outputRange: ['-20deg', '0deg', '20deg'],
    });

    const cardDinamicStyle = [
        styles.cardStyle,
        {
            backgroundColor: item.backgroundColor,
            width: this.cardSize,
            height: this.cardSize,
            opacity: this.cardOpacity,
            transform: [
                { translateX: this.state.Xposition },
                { translateY: this.state.Yposition },
                { rotate: rotateCard },
            ],
        },
    ];
 
    return (
        <View
            {...this.panResponder.panHandlers}
            style={styles.container}
        >
            <Animated.View style={cardDinamicStyle} >
                <Text style={styles.cardTitle}>
                    {item.cardTitle}
                </Text>
            </Animated.View>
        </View>
    );
  }



  animatedSwipe = (toValue, callBack) => Animated.parallel(
    [
      Animated.timing(this.state.Xposition, {
        toValue: toValue,
        duration: SPEED_ANIMATED,
      }),

      Animated.timing(this.cardOpacity, {
        toValue: 0,
        duration: SPEED_ANIMATED,
      }),
    ],
    { useNativeDriver: true }
  ).start(callBack);

  animatedAdd = (index) => Animated.parallel(
    [
      Animated.timing(this.state.Yposition, {
        toValue: index*(-10),
        duration: SPEED_ANIMATED,
      }),
      Animated.timing(this.cardSize, {
        toValue: 200 - index*(10),
        duration: SPEED_ANIMATED,
      }),
      Animated.timing(this.cardOpacity, {
        toValue: 1,
        duration: SPEED_ANIMATED,
      }),
    ],
    { useNativeDriver: true }
  ).start(() => {});

  animatedRemove = (index) => {   
    Animated.parallel(
        [
          Animated.timing(this.state.Xposition, {
            toValue: SCREEN_WIDTH,
            duration: 0,
          }),
    
          Animated.timing(this.cardOpacity, {
            toValue: 0,
            duration: 0,
          }),
          Animated.timing(this.state.Yposition, {
            toValue: index*(-10),
            duration: 0,
          }),
          Animated.timing(this.cardSize, {
            toValue: 200 - index*(10),
            duration: 0,
          }),
        ],
        { useNativeDriver: true }
    ).start();
    
    Animated.parallel(
    [
      Animated.timing(this.state.Xposition, {
        toValue: 0,
        duration: SPEED_ANIMATED,
      }),

      Animated.timing(this.cardOpacity, {
        toValue: 1,
        duration: SPEED_ANIMATED,
      }),
    ],
    { useNativeDriver: true }
    ).start()};
}
 
const styles = StyleSheet.create({
  container: {
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      top: 100,
  },
  cardStyle: {
    width: 200,
    height: 200,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    color: '#fff',
    fontSize: 24,
  },
});