import Catalyst from '../../Assets/catalyst-logo.svg';
import Cardano from '../../Assets/cardano-logo.svg';
import Aim from '../../Assets/aim-logo.svg';

function CardanoLogos() {
  return (
    <div style={{ width: '80%', margin: 'auto', display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
      <img src={Catalyst} alt="Catalyst" style={{ marginRight: '25px' }} />
      <img src={Cardano} alt="Cardano" style={{ marginRight: '25px' }} />
      <img src={Aim} alt="Aim" />
    </div>
  );
}

export default CardanoLogos;
