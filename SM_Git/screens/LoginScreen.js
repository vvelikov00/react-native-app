import React from 'react'
import { useState, useEffect } from 'react'
import { View, Text} from 'react-native'
import { Button, Input } from 'react-native-elements'
import { TouchableHighlight } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { supabase } from '../src/supabaseClient'
import styles from '../styles/login-register-screens'

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
            <TouchableOpacity style={styles.Btn} onPress={() => navigation.navigate('Register')}>
                <Text style={styles.BtnT}>Register</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.Btn}>
                <Text style={styles.fPass}>Forgotten password? </Text>
            </TouchableOpacity>

            
        </View>
    )
}

export default LoginScreen

