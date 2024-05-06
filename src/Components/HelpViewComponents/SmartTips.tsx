import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TemplateCard from 'Components/TemplateCard';

function SmartTips() {
  //Fill with tips when implemented
  const templatesArray = [
    {
      title: 'Template 1',
      description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, 
      nisl eget consectetur euismod, nisl nunc ultrices eros, vitae porttitor nisl nunc eget lorem.`,
      image: '',
    },
    {
      title: 'Template 2',
      description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, 
      nisl eget consectetur euismod, nisl nunc ultrices eros, vitae porttitor nisl nunc eget lorem.`,
      image: '',
    },
    {
      title: 'Template 3',
      description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, 
      nisl eget consectetur euismod, nisl nunc ultrices eros, vitae porttitor nisl nunc eget lorem.`,
      image: '',
    },
    {
      title: 'Template 4',
      description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, 
      nisl eget consectetur euismod, nisl nunc ultrices eros, vitae porttitor nisl nunc eget lorem.`,
      image: '',
    },
    {
      title: 'Template 5',
      description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, 
      nisl eget consectetur euismod, nisl nunc ultrices eros, vitae porttitor nisl nunc eget lorem.`,
      image: '',
    },
    {
      title: 'Template 6',
      description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, 
      nisl eget consectetur euismod, nisl nunc ultrices eros, vitae porttitor nisl nunc eget lorem.`,
      image: '',
    },
  ];
  return (
    <Grid container spacing={2} sx={{ width: '80%', margin: 'auto' }}>
      <Grid item sx={{ width: '80%', display: 'flex', flexDirection: 'row', marginBottom: '30px' }}>
        <Typography sx={{ fontWeight: 'bold', fontSize: '24px' }}>Smart Tips</Typography>
      </Grid>
      {templatesArray.map((template) => {
        return (
          <Grid item xs={6} md={4} key={template.title}>
            <TemplateCard title={template.title} description={template.description} image={template.image} />
          </Grid>
        );
      })}
    </Grid>
  );
}

export default SmartTips;
