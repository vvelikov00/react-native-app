import React from 'react'
import { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Platform, StatusBar } from 'react-native'
import { Button, Input } from 'react-native-elements'
import { TouchableHighlight } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { supabase } from '../src/supabaseClient'


const LoginScreen = ({navigation, session}) => {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => {const session = supabase.auth.session()
      //console.log(session)
      if (session) {
         navigation.navigate('Home')
      }
     }, 100)
  }, [])



    const handleLogin = async (email, password, navigate) => {
        try {
          setLoading(true)
          const { error } = await supabase.auth.signIn({ email: email, password: password})

          if(!error)
          navigate('Home');
          if (error) throw error
            
        } catch (error) {
          alert(error.error_description || error.message)
        } finally {
          setLoading(false)
          
        }
      }

    return (
        <View style={styles.container}>
           
            <Input
            placeholder="Enter your email"
            label="Email"
            rightIcon={{type:'material', name:'email'}}
            value={email}
            onChangeText={text => setEmail(text)}
            />
             <Input
            placeholder="Enter your password"
            label="Password"
            rightIcon={{type:'material', name:'lock'}}
            value={password}
            onChangeText={text => setPassword(text)}
            secureTextEntry
            />
            <TouchableHighlight style={styles.button}>
                <Button title='Sign in' buttonStyle={styles.signBtn}  onPress={(e) => {
              e.preventDefault()
              handleLogin(email, password, navigation.navigate)
            }}/>
            </TouchableHighlight>
            <TouchableOpacity style={styles.regBtn} onPress={() => navigation.navigate('Register')}>
                <Text style={styles.regBtnT}>Register</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.regBtn}>
                <Text style={styles.fPass}>Forgotten password? </Text>
            </TouchableOpacity>

            
        </View>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        padding: 10,
        backgroundColor: '#fff',
    },

    button:{
        width: '90%',
        marginTop: 10,
    },

    regBtn:{
        width: '90%',
        marginTop: 10,
        alignItems: 'center',
        borderColor: 'dodgerblue',
        borderStyle: 'solid',
    },

    regBtnT:{
        marginTop: 10,
        color: 'dodgerblue',
        fontSize: 20,
    },

    fPass: {
        marginTop: 10,
        color: 'black',

    }
    
});
