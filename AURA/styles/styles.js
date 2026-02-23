import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  containerButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },

  img: {
    width: 300,
    height: 300,
  },

  titulo: {
    fontWeight: '500',
    fontSize: 30,
    color: '#FFF3DC',
  },

  btnLogin: {
    backgroundColor: '#5c0f25',
    color: '#FFF3DC',
    fontWeight: 'bold',
    borderWidth: 2,
    borderColor: '#FFF3DC',
    width: 300,
    padding: 10,
    borderRadius: 20,
  },


  btnCadastro: {
    backgroundColor: '#FFF3DC',
    color: '#5c0f25',
    padding: 10,
    width: 300,
    borderRadius: 20,
  },

  btnLoginText: {
    color: '#FFF3DC',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
  },

  btnCadastroText: {
    color: '#5c0f25',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
  },
});
