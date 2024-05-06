import React, { useEffect } from 'react';
import statusIndicator from 'Assets/status-marker.png';
import styled from '@mui/system/styled';
import Grid from '@mui/material/Grid';

const IndicatorSection = styled(Grid)`
  width: 18px;
  height: 8px;
`;

export default function StatusIndicator({
  status,
  numberSections = 5,
  proposalId,
}: {
  status: number;
  numberSections: number;
  proposalId: string;
}) {
  const [indicatorGrid, setIndicatorGrid] = React.useState<JSX.Element[]>([]);
  const [colorGrid, setColorGrid] = React.useState<JSX.Element[]>([]);
  useEffect(() => {
    const indicatorGrid: JSX.Element[] = [];
    const colorGrid: JSX.Element[] = [];
    const colors = ['#3C4041BA', '#FFC700', '#BDFF00', '#38D059', '#1BC3DA'];
    if (status != undefined && numberSections) {
      for (let i = 0; i < numberSections; i++) {
        const key = `${proposalId}-ind-${i}`;
        indicatorGrid.push(
          <IndicatorSection item key={key} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '14px' }}>
            {i === status ? <img src={statusIndicator} style={{ width: '9px', height: '13px' }} /> : ' '}
          </IndicatorSection>,
        );
        let colorGridItem: JSX.Element;
        if (i == 0) {
          colorGridItem = (
            <IndicatorSection item key={key + 'color'} sx={{ backgroundColor: colors[i], borderRadius: '20px 0px 0px 20px;' }} />
          );
        } else if (i == numberSections - 1) {
          colorGridItem = (
            <IndicatorSection item key={key + 'color'} sx={{ backgroundColor: colors[i], borderRadius: '0px 20px 20px 0px;' }} />
          );
        } else {
          colorGridItem = <IndicatorSection item key={key + 'color'} sx={{ backgroundColor: colors[i] }} />;
        }
        colorGrid.push(colorGridItem);
      }
      setIndicatorGrid(indicatorGrid);
      setColorGrid(colorGrid);
    }
  }, [status, numberSections]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Grid container direction="row">
        {indicatorGrid}
      </Grid>
      <Grid container direction="row">
        {colorGrid}
      </Grid>
    </div>
  );
}
