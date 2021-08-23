import React, {useState, useEffect} from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


interface IDelivery{
  end: Date;
  start: Date;
}

interface IDeliveryAddress{
  administrative_area: string;
  country_code: string;
  line_1: string;
  locality: string;
  postal_code: string;
}

interface IPickup{
  end: Date;
  start: Date;
}

interface IPickupAddress{
  administrative_area: string;
  country_code: string;
  line_1: string;
  locality: string;
  postal_code: string;
}

interface IReward{
  amount: number;
  currency: string;
}

interface ITransport {
  id: number;
  delivery: IDelivery;
  delivery_address: IDeliveryAddress;
  max_volume_m3: number;
  pickup: IPickup;
  pickup_address: IPickupAddress;
  reward: IReward;
}

function App() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState<ITransport[]>([]);

  const classes = useStyles();

  useEffect(() => {
    fetch("https://brenger-interviews.s3.amazonaws.com/open_transport_jobs.json")
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [])


  if (error) {
    return <div className={classes.root}>Error: {error}</div>;
  } else if (!isLoaded) {
    return <div className={classes.root}>Loading...</div>;
  } else {
    return (
        <Grid container >
          {items.map(item => (
            <Grid item xs={12} key={item.id}>
              <Accordion>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="Transport-content"
                id="Transport-header">
                  <Typography className={classes.heading}>Transport <span style={{fontWeight: 'bold'}}>{item.id}</span></Typography>
                  <Typography className={classes.secondaryHeading}>{item.delivery_address.locality} to {item.pickup_address.locality}</Typography>
                  <Typography className={classes.thirdHeading}>({item.reward.amount} {item.reward.currency})</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid item xs={6}>
                    <Paper className={classes.paper}>
                      <div style={{padding: 5}} >
                        <p>delivery location</p>
                        <p>{item.delivery_address.line_1}, {item.delivery_address.postal_code}, {item.delivery_address.locality}</p>
                        <p>{item.delivery_address.administrative_area}, {item.delivery_address.country_code}</p>
                      </div>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper className={classes.paper}>
                      <div style={{ padding: 5}} >
                       <p>pickup location</p>
                       <p>{item.pickup_address.line_1}, {item.pickup_address.postal_code}, {item.pickup_address.locality}</p>
                       <p>{item.pickup_address.administrative_area}, {item.pickup_address.country_code}</p>
                     </div>
                    </Paper>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
          ))}
        </Grid>
    );
  }

}

const useStyles = makeStyles((theme) => ({
  paper: {
    // padding: 5,
    // textAlign: 'center',
    color: theme.palette.text.secondary,
    width: '100%',
  },
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
    flexBasis: '50%',
    flexShrink: 0,
  },  
  thirdHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.primary,
    paddingLeft: 10
  },
}));

export default App;
