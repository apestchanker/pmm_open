import { Grid, Typography } from '@mui/material';
import TemplateCard from 'Components/TemplateCard';
import ImportExportOutlinedIcon from '@mui/icons-material/ImportExportOutlined';
import TuneIcon from '@mui/icons-material/Tune';
function Templates() {
  //This component should call a GET_TEMPLATES query when it's implemented into
  //the backend.

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
      <Grid item sx={{ width: '80%', display: 'flex', cursor: 'pointer', flexDirection: 'row', marginBottom: '30px' }}>
        <ImportExportOutlinedIcon />
        <Typography sx={{ width: '100px', fontSize: '14px' }}>Sort By</Typography>
        <TuneIcon />
        <Typography sx={{ width: '100px', fontSize: '14px' }}>Filter</Typography>
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

export default Templates;
