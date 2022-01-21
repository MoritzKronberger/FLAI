import { Chart, Title, Tooltip } from 'chart.js'
import annotationPlugin from 'chartjs-plugin-annotation'
Chart.register(Title, Tooltip, annotationPlugin)

Chart.defaults.plugins.title.display = true
