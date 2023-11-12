import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import * as SQLite from 'expo-sqlite';

export default function Home() {
  const [movis, setMovis] = useState([]);

  const db = SQLite.openDatabase('dados.db');

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT M.*, P.DESCR AS PLANO_DESCR FROM MOVIMENTACAO M LEFT JOIN PLANO_CONTA P ON M.PLANO_CODI = P.PL_CODI',
        null,
        (txObj, resultSet) => setMovis(resultSet.rows._array),
        (txObj, error) => console.log('Erro na transação:', error)
      );
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        <Text style={styles.titleUno}>Uno</Text> Finanças
      </Text>
      <StatusBar backgroundColor='black' translucent />

      {movis.length > 0 ? (
        movis.map(movi => (
          <View key={movi.MO_CODI} style={styles.moviContainer}>
            <View style={styles.moviInfo}>
              <Text style={styles.label}>Data:</Text>
              <Text style={styles.value}>{movi.DATA}</Text>
            </View>
            <View style={styles.moviInfo}>
              <Text style={styles.label}>Descrição:</Text>
              <Text style={styles.value}>{movi.DESCR}</Text>
            </View>
            <View style={styles.moviInfo}>
              <Text style={styles.label}>Valor:</Text>
              <Text style={styles.value}>{movi.VALOR}</Text>
            </View>
            <View style={styles.moviInfo}>
              <Text style={styles.label}>Plano de Contas:</Text>
              <Text style={styles.value}>{movi.PLANO_CODI}</Text>
            </View>
          </View>
        ))
      ) : (
        <Text>Nenhuma movimentação cadastrada ainda.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
  },

  titleUno: {
    color: '#49FF14',
  },

  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'blue',
    marginTop: 40,
  },

  moviContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginVertical: 10,
    width: '80%',
  },

  moviInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  label: {
    fontWeight: 'bold',
    marginRight: 8,
  },

  value: {
    flex: 1,
  },
});