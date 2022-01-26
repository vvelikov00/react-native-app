import React from 'react'
import {View, Image} from 'react-native'
import styles from '../styles/mainScreens'
export const Header = () => {
  return  <View style={styles.header}>
    <Image style={styles.logo} source={require('../images/SM.png')}/>
</View>
}
