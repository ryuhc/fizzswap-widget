import { createRoot } from 'react-dom/client'

import './i18n'
import App from './App'

if (import.meta.env.VITE_IS_LOCAL) {
  createRoot(document.getElementById('root')!).render(
    <div>
      <App
        swapType="normal"
        selectable={false}
        inputAmount="0.1"
        inputTokenAddress="0x0000000000000000000000000000000000000000"
        outputTokenAddress="0x1e4a5963abfd975d8c9021ce480b42188849d41d"
      />
    </div>
  )
}

export default App