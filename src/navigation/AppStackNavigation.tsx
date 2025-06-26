import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AppTabNavigation from "./AppTabNavigation";

const Stack = createNativeStackNavigator();
const AppStackNavigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen
                    name="Home"
                    component={AppTabNavigation}
                />

            </Stack.Navigator>
        </NavigationContainer>
    )
}


export default AppStackNavigation;