const phaseSelector = (status: string) => {
  switch (status) {
    case 'raw-land':
      return 'Raw land';
    case 'crop':
      return 'Crop';
    case 'planting':
      return 'Planting';
    default:
      return 'No phase';
  }
};

export default phaseSelector;
