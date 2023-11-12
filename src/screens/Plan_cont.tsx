import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native"
import { Ionicons } from '@expo/vector-icons'
import React, { useState } from "react"
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button"
import * as SQLite from 'expo-sqlite'
import { useEffect } from "react"

export default function PlanContScreen() {
	const [CDType, setCDType] = useState('test');
	const [hist, setHist] = useState('');
	const [plans, setPlans] = useState([]);
  
	const db = SQLite.openDatabase('dados.db')
  
	useEffect(() => {
	  db.transaction((tx) => {
		tx.executeSql(
		  'CREATE TABLE IF NOT EXISTS plano_conta (PL_CODI INTEGER PRIMARY KEY AUTOINCREMENT, DESCR TEXT, TYPE TEXT);'
		);
	  });

	  db.transaction(tx => {
		tx.executeSql('SELECT * FROM plano_conta', null,
		(txObj, resultSet) => setPlans(resultSet.rows._array),
		(txObj, error) => console.log('Erro na transação:', error)
		)
	  })
	}, []);
  
	function handleAddPlan() {
	  db.transaction(
		(tx) => {
		  tx.executeSql(
			'INSERT INTO plano_conta (DESCR, TYPE) VALUES (?, ?)',
			[hist, CDType],
			(txObj, resultSet) => {
			  let existingPlans = [...plans];
			  existingPlans.push({
				PL_CODI: resultSet.insertId,
				DESCR: hist,
				TYPE: CDType,
			  });
			  setPlans(existingPlans);
			},
			(txObj, error) => console.log('Erro na transação:', error)
		  );
		},
		(error) => console.log('Erro ao abrir a transação:', error)
	  );

	  setHist('')
	}

	return (
		<View style={styles.container}>
		  <Text style={styles.title}>Cadastre um novo plano de contas</Text>
		  <View style={styles.inputArea}>
			<TextInput style={styles.input} onChangeText={(text) => setHist(text)} />
			<TouchableOpacity style={styles.addButton} onPress={handleAddPlan}>
			  <Ionicons name="add-circle-outline" size={36} color='white' />
			</TouchableOpacity>
		  </View>
		  <View style={styles.type}>
			<RadioButtonGroup
			  containerStyle={{ marginBottom: 10 }}
			  selected={CDType}
			  onSelected={(value) => setCDType(value)}
			  radioBackground="green"
			>
			  <RadioButtonItem value="C" label={<Text style={{ color: "green" }}>Crédito</Text>} />
			  <RadioButtonItem value="D" label={<Text style={{ color: "red" }}>Débito</Text>} />
			</RadioButtonGroup>
		  </View>
		  {plans.length > 0 ? (
			plans.map((plan) => (
			  <View key={plan.PL_CODI} style={styles.planContainer}>
				<Text style={styles.planText}>{plan.DESCR}</Text>
				<Text style={[styles.planText, plan.TYPE === 'C' ? styles.creditText : styles.debitText]}>
				  {plan.TYPE === 'C' ? 'Crédito' : 'Débito'}
				</Text>
			  </View>
			))
		  ) : (
			<Text style={styles.noPlansText}>Nenhum plano cadastrado ainda.</Text>
		  )}
		</View>
	  );
}

const styles = StyleSheet.create({
	container: {
	  flex: 1,
	  backgroundColor: '#f0f0f0',
	  alignItems: 'center',
	  paddingTop: 20,
	},
  
	title: {
	  color: '#333',
	  fontWeight: 'bold',
	  fontSize: 24,
	  marginBottom: 20,
	},
  
	input: {
	  backgroundColor: 'white',
	  borderColor: 'black',
	  borderWidth: 1,
	  width: 200,
	  height: 40,
	  borderRadius: 8,
	  marginTop: 20,
	  paddingHorizontal: 10,
	},
  
	inputArea: {
	  flexDirection: 'row',
	  alignItems: 'center',
	  justifyContent: 'center',
	  marginTop: 12,
	},
  
	addButton: {
	  marginLeft: 10,
	  backgroundColor: 'green',
	  padding: 10,
	  borderRadius: 8,
	},
  
	addButtonText: {
	  color: 'white',
	  fontSize: 16,
	},
  
	type: {
	  flexDirection: 'row',
	  marginTop: 20,
	},
  
	planContainer: {
	  backgroundColor: 'white',
	  borderRadius: 8,
	  padding: 16,
	  marginVertical: 8,
	  width: 300,
	},
  
	planText: {
	  fontSize: 16,
	  color: '#333',
	},
  
	creditText: {
	  color: 'green',
	},
  
	debitText: {
	  color: 'red',
	},
  
	noPlansText: {
	  marginTop: 20,
	  fontSize: 16,
	  color: '#666',
	},
  });