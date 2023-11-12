import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import MoviScreen from '../screens/Movi'
import PlanContScreen from '../screens/Plan_cont'
import Home from '../screens/Home'
import { Ionicons } from '@expo/vector-icons';

const { Navigator, Screen } = createBottomTabNavigator()

export function Routes() {
	return (
		<NavigationContainer>
			<Navigator>
				<Screen
					name='Home'
					component={Home}
					options={{
						tabBarIcon: () => <Ionicons name='home-outline' size={28} color='gray' />
					}}
				/>

				<Screen
					name='Movimentos'
					component={MoviScreen}
					options={{
						tabBarIcon: () => <Ionicons name='bar-chart-outline' size={28} color='gray' />
					}}
				/>

				<Screen
					name='Plano de Contas'
					component={PlanContScreen}
					options={{
						tabBarIcon: () => <Ionicons name='clipboard-outline' size={28} color='gray' />
					}}
				/>
			</Navigator>
		</NavigationContainer>
	)
}