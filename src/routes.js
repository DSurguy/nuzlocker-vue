/**
 * We have to export routes like this so we can get them 
 *  into unit tests WHY IS THIS SO COMPLICATED
 */
import App from './App.vue'
import RunList from './components/RunList.vue'
import RunViewer from './components/RunViewer.vue'

const routes = [
  { 
    path: '/', 
    component: App,
    children: [
      { path: '', component: RunList },
      { path: 'run/:id', component: RunViewer }
    ]
  }
]

export default routes