import { View, Text, StyleSheet, TextInput } from "react-native";
import {Picker} from '@react-native-picker/picker';
import { useState, useEffect } from "react";
import * as SQLite from 'expo-sqlite'
import { TouchableOpacity } from "react-native-gesture-handler";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function MoviScreen() {
	const [selectedPlan, setSelecterPlan] = useState()
	const [hist, setHist] = useState('')
	const [plans, setPlans] = useState([])
	const [value, setValue] = useState(0)

	const db = SQLite.openDatabase('dados.db')

	useEffect(() => {
		db.transaction(tx => {
		  tx.executeSql('SELECT * FROM plano_conta', null,
		  (txObj, resultSet) => setPlans(resultSet.rows._array),
		  (txObj, error) => console.log('Erro na transação:', error)
		  )
		})
	}, []);

	function handleAddMovi() {
		const date = new Date()

		const day = date.getDate().toString().padStart(2, '0');
		const month = (date.getMonth() + 1).toString().padStart(2, '0');
		const year = date.getFullYear();

		const finalDate = `${day}/${month}/${year}`

		db.transaction(
			(tx) => {
			tx.executeSql(
				'CREATE TABLE IF NOT EXISTS MOVIMENTACAO (ID INTEGER PRIMARY KEY AUTOINCREMENT, DESCR TEXT, PLANO_CODI INTEGER, VALOR REAL, DATA TEXT);'
			);

			  tx.executeSql(
				'INSERT INTO MOVIMENTACAO (DESCR, PLANO_CODI, VALOR, DATA) VALUES (?, ?, ?, ?)',
				[hist, selectedPlan, value, finalDate],
				(txObj, error) => console.log('Erro na transação:', error)
			  );
			},
			(error) => console.log('Erro ao abrir a transação:', error)
		  );

		  setHist('')
		  setValue(0)
		  setSelecterPlan(0)
	}

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<View style={styles.container}>
				<Text style={styles.title}>Cadastre uma nova movimentação</Text>
				<TextInput style={styles.input} placeholder="Histórico..." onChangeText={(text) => setHist(text)}/>
				<View style={styles.pickerContainer}>
					<Picker 
						selectedValue={selectedPlan}
						onValueChange={(itemValue, itemIndex) =>
							setSelecterPlan(itemValue)
						}
						style={styles.picker}>
						<Picker.Item label="Selecione a operação" value={0} />
						{plans.length > 0 ? (
							plans.map((plan) => (
								<Picker.Item key={plan.PL_CODI} label={plan.DESCR} value={plan.PL_CODI} />
							))
						) : null}
						
						
					</Picker>
				</View>

				<TextInput keyboardType="numeric" style={styles.input} placeholder="R$ 0.00" onChangeText={(text) => setValue(text)}/>

				<TouchableOpacity style={styles.addButton} onPress={handleAddMovi}>
				<Text style={styles.addButtonText}>Adicionar</Text>
				</TouchableOpacity>

				<View>

				</View>
			</View>
		</GestureHandlerRootView>
	)
}

const styles = StyleSheet.create({
	container: {
	  flex: 1,
	  backgroundColor: '#EEEEEE',
	  alignItems: 'center',
	  paddingTop: 20
	},

	title: {
		color: 'gray',
		fontWeight: "bold",
		fontSize: 20
	},

	input: {
		backgroundColor: 'white',
		borderColor: 'black',
		width: 300,
		height: 40,
		borderRadius: 8,
		marginTop: 20,
		padding: 10
	},

	inputArea: {
		display: 'flex',
		gap: 12,
		flexDirection: "row",
		alignItems: 'center',
		justifyContent: 'center',
	},

	addButton: {
		backgroundColor: '#4CAF50', // Cor de fundo verde
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderRadius: 8,
		marginTop: 20,
		alignItems: 'center',
		justifyContent: 'center',
	},

	pickerContainer: {
		borderWidth: 1,
		borderColor: "black",
		borderRadius: 8,
		marginTop: 10,
		overflow: "hidden", // Garante que as bordas arredondadas são aplicadas corretamente
	},
	
	picker: {
		width: 300,
		height: 40,
		color: "black", // Cor do texto do Picker
	},

	addButtonText: {
		color: '#FFFFFF', // Cor do texto branco
		fontSize: 18,
		fontWeight: 'bold',
	},
})    