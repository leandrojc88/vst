import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
      options: {
        customProperties: true,
      },
    themes: {
      light: {
        primary: '#0D47A1', // blue darken-4
        secondary: '#1976D2', //blue darken-2
        accent: '#82B1FF',//blue accent-1
		
        error: '#FF5252',//red accent-2
        info: '#2196F3', //blue 
        success: '#4CAF50',//green 
        warning: '#FFC107'//amber 
      },
    },
  },
});
