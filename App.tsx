import "react-native-reanimated";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider, AuthContext } from "./app/context/AuthContext";
import RootNavigator from "./app/navigation/RootNavigator";
import AuthNavigator from "./app/navigation/AuthNavigator";
import React, { useContext } from "react";

import "./global.css"

function MainNavigator() {
    const { token } = useContext(AuthContext);
    return token ? <RootNavigator /> : <AuthNavigator />;
}

export default function App() {
    return (
        <AuthProvider>
            <NavigationContainer>
                <MainNavigator />
            </NavigationContainer>
        </AuthProvider>
    );
}
