// Beispiel für WS-Integration – hängt von deiner Runtime ab
import { validator } from '../core/validator';

export function attachValidatorWS(wss: any) {
  validator.on('interaction', (event) => {
    const data = JSON.stringify(event);
    wss.clients.forEach((client: any) => {
      if (client.readyState === 1) client.send(data);
    });
  });
}
