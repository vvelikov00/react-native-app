import React from 'react'
import { useState } from 'react'
import { View, Text} from 'react-native'
import { Button, Input } from 'react-native-elements'
import { TouchableHighlight } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { supabase } from '../src/supabaseClient'
import { LogBox } from 'react-native';
import styles from '../styles/settingsScreens'

LogBox.ignoreLogs(['Setting a timer']);

const RegisterScreen = ({navigation}) => {
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');


    const handleRegister = async (email, password, username, name, navigate) => {
        try {
          setLoading(true)
          const { error } = await supabase.auth.signUp({ email, password}, {
              data: {
                  name,
                  username,
              }
          })

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
            placeholder="Enter your name"
            label="Name"
            rightIcon={{type:'material', name:'person'}}
            value={name}
            onChangeText={text => setName(text)}
            required
            />
            <Input
            placeholder="Enter your email"
            label="Email"
            rightIcon={{type:'material', name:'email'}}
            value={email}
            onChangeText={text => setEmail(text)}
            onChange={(e) => setEmail(e.target.value)}
            />
             <Input
            placeholder="Enter your username"
            label="Username"
            rightIcon={{type:'material', name:'person'}}
            value={username}
            onChangeText={text => setUsername(text)}
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
                <Button title='Register' buttonStyle={styles.signBtn}  onPress={(e) => {
              e.preventDefault()
              handleRegister(email, password, username, name, navigation.navigate)
            }}/>
            </TouchableHighlight>

            <TouchableOpacity style={styles.Btn} onPress={()=> navigation.navigate('Login')}>
                <Text style={styles.BtnT}>Sign in</Text>
            </TouchableOpacity>


            
        </View>
    )
}

export default RegisterScreen
