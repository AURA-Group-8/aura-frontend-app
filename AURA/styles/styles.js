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

  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    padding: 10,
  },

  backButtonText: {
    fontSize: 28,
    color: '#FFF3DC',
    fontWeight: 'bold',
  },

  textInput: {
    backgroundColor: '#5c0f25',
    color: '#FFF3DC',
    borderWidth: 2,
    borderColor: '#FFF3DC',
    width: 300,
    padding: 12,
    borderRadius: 20,
    fontWeight: '500',
  },

  textInputWithMargin: {
    backgroundColor: '#5c0f25',
    color: '#FFF3DC',
    borderWidth: 2,
    borderColor: '#FFF3DC',
    width: 300,
    padding: 12,
    borderRadius: 20,
    marginBottom: 10,
    fontWeight: '500',
  },

  signUpContainer: {
    flex: 1,
    backgroundColor: '#281111',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  signUpLogo: {
    width: 250,
    height: 250,
    marginBottom: 30,
  },

  signUpTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFF3DC',
  },

  signUpForm: {
    // Adicionado para o View do formulário
  },

  signUpInput: {
    borderWidth: 1,
    borderColor: '#982546',
    backgroundColor: '#fff3dc',
    color: '#281111',
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    width: 350,
  },

  signUpButton: {
    marginTop: 10,
    alignSelf: 'center',
    width: 175,
    borderWidth: 2,
    borderColor: '#982546',
    backgroundColor: '#FFF3DC',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },

  signUpButtonText: {
    color: '#982546',
    fontWeight: 'bold',
  },

  animacao: {
    // Estilo para a animação na splash screen
  },

  loadingText: {
    fontSize: 50,
    color: '#FFF3DC',
  },

  arco: {
    width: 50,
    height: 25,
    borderTopWidth: 5,
    borderTopColor: '#FFF3DC',
    borderLeftWidth: 5,
    borderLeftColor: '#FFF3DC',
    borderRightWidth: 5,
    borderRightColor: '#FFF3DC',
    borderRadius: 25,
    borderBottomWidth: 0,
  },

  arcoIris: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
});
