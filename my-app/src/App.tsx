import React, { useState, useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import EuroIcon from "@material-ui/icons/Euro";
import FormControl from "@material-ui/core/FormControl";
import SettingsIcon from "@material-ui/icons/Settings";
import TextField from "@material-ui/core/TextField";
import Geocode from "react-geocode";
import Button from "@material-ui/core/Button";
import { GoogleMap, LoadScript } from "@react-google-maps/api";

Geocode.setLanguage("en");
Geocode.setApiKey("AIzaSyB26A_1y8xU5rltpxP1CfE1PwqiA5W3YDs");

interface IDelivery {
  end: Date;
  start: Date;
}

interface IDeliveryAddress {
  administrative_area: string;
  country_code: string;
  line_1: string;
  locality: string;
  postal_code: string;
}

interface IPickup {
  end: Date;
  start: Date;
}

interface IPickupAddress {
  administrative_area: string;
  country_code: string;
  line_1: string;
  locality: string;
  postal_code: string;
}

interface IReward {
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

interface ICoordinates {
  lat: number;
  lng: number;
}

function App() {
  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [items, setItems] = useState<ITransport[]>([]);
  const [lat, setLat] = useState<string>("");
  const [lng, setLng] = useState<string>("");
  const [cordinates, setCordinates] = useState<ICoordinates[]>([]);
  const [cordinatesDel, setCordinatesDel] = useState<ICoordinates[]>([]);
  const classes = useStyles();
  useEffect(() => {
    fetch(
      "https://brenger-interviews.s3.amazonaws.com/open_transport_jobs.json"
    )
      .then((res) => res.json())
      .then(
        async (result) => {
          setIsLoaded(true);
          setItems(result);
          let adr;
          let postcode;
          let local;
          let cords: ICoordinates[] = [];

          let adr_del;
          let postcode_del;
          let local_del;
          let cords_del: ICoordinates[] = [];

          for (let i = 0; i < result.length; i++) {
            // setIsLoaded(true);
            adr = result[i].pickup_address.line_1;
            postcode = result[i].pickup_address.postal_code;
            local = result[i].pickup_address.locality;

            var address = adr + " " + postcode + " " + local;
            await Geocode.fromAddress(address).then(
              (response) => { 
                let lat = response.results[0].geometry.location.lat;
                let lng = response.results[0].geometry.location.lng;
                let cord = { lat, lng };
                cords.push(cord);
                return cords;
              },
              (error) => {
                console.error(error);
              }
            );
          }
          for (let i = 0; i < result.length; i++) {
            // setIsLoaded(true);
            adr_del = result[i].delivery_address.line_1;
            postcode_del = result[i].delivery_address.postal_code;
            local_del = result[i].delivery_address.locality;

            var address = adr_del + " " + postcode_del + " " + local_del;
            await Geocode.fromAddress(address).then(
              (response) => { 
                let lat = response.results[0].geometry.location.lat;
                let lng = response.results[0].geometry.location.lng;
                let cord = { lat, lng };
                cords_del.push(cord);
                return cords_del;
              },
              (error) => {
                console.error(error);
              }
            );
          }
          setCordinates(cords);
          setCordinatesDel(cords_del)
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, []);

  useEffect(() => {
  }, [cordinatesDel,cordinates]);


  let index:number = 0;

  if (error) {
    return <div className={classes.root}>Error: {error.toString()}</div>;
  } else if (!isLoaded) {
    return <div className={classes.root}>Loading...</div>;
  } else {
    return (
      <Grid container style={{ padding: 20 }}>
        {items.map((item, index) => (
          <Grid item xs={12} key={item.id}>
            <Accordion style={{ borderRadius: 0, backgroundColor: "#3b82f6" }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon style={{ color: "white" }} />}
                aria-controls="Transport-content"
                id="Transport-header"
              >
                <Typography className={classes.heading}>
                  Transport
                  <span style={{ fontWeight: "bold" }}> {item.id}</span>
                </Typography>
                <Typography className={classes.secondaryHeading}>
                  {item.pickup_address.locality} to{" "}
                  {item.delivery_address.locality}
                </Typography>
                {/* <Typography className={classes.thirdHeading}>
                  ({item.reward.amount.toFixed(2)} {item.reward.currency})
                </Typography> */}
              </AccordionSummary>
              <AccordionDetails>
                <Grid container>
                  <Grid
                    item
                    xs={6}
                    style={{ marginBottom: 5 }}
                    className={classes.transform}
                  >
                    <Paper className={classes.paper} elevation={3}>
                      <FormControl className={classes.margin} disabled>
                        <InputLabel htmlFor="input-with-icon-adornment">
                          max_volume_m3
                        </InputLabel>
                        <Input
                          value={item.max_volume_m3}
                          id="input-with-icon-adornment"
                          startAdornment={
                            <InputAdornment position="start">
                              <SettingsIcon />
                            </InputAdornment>
                          }
                        />
                      </FormControl>
                    </Paper>
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    style={{ marginBottom: 5 }}
                    className={classes.transform}
                  >
                    <Paper className={classes.paper} elevation={3}>
                      <FormControl className={classes.margin} disabled>
                        <InputLabel htmlFor="input-with-icon-adornment">
                          Reward
                        </InputLabel>
                        <Input
                          value={item.reward.amount.toFixed(2)}
                          id="input-with-icon-adornment"
                          startAdornment={
                            <InputAdornment position="start">
                              <EuroIcon />
                            </InputAdornment>
                          }
                        />
                      </FormControl>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6} className={classes.transform}>
                    <Grid
                      container
                      style={{ backgroundColor: "aliceblue", width: "99.5%" }}
                    >
                      <Grid item xs={12} md={6} style={{ padding: 15 }}>
                        <Typography
                          variant="overline"
                          display="block"
                          gutterBottom
                          className={classes.txt}
                        >
                          pickup location
                        </Typography>
                        <div style={{ border: "2px solid", padding: 10 }}>
                          <TextField
                            id="pickup_address.line_1"
                            label="Pickup Address"
                            value={item.pickup_address.line_1}
                            style={{ width: "100%", marginBottom: 10 }}
                            className={classes.txtField}
                            disabled
                          />
                          <TextField
                            id="pickup_address.postal_code"
                            label="Postal Code"
                            value={item.pickup_address.postal_code}
                            style={{ width: "100%", marginBottom: 10 }}
                            className={classes.txtField}
                            disabled
                          />
                          <TextField
                            id="pickup_address.locality"
                            label="Locality"
                            value={item.pickup_address.locality}
                            style={{ width: "100%", marginBottom: 10 }}
                            className={classes.txtField}
                            disabled
                          />
                          <TextField
                            id="pickup_address.administrative_area"
                            label="Are and Country Code"
                            value={
                              item.pickup_address.administrative_area +
                              " - " +
                              item.pickup_address.country_code
                            }
                            style={{ width: "100%", marginBottom: 10 }}
                            className={classes.txtField}
                            disabled
                          />
                        </div>
                        <Typography
                          variant="overline"
                          display="block"
                          gutterBottom
                          className={classes.txt}
                        >
                          pickup date
                        </Typography>
                        <div style={{ border: "2px solid", padding: 10 }}>
                          <TextField
                            id="pickup.start"
                            label="Start Date"
                            value={item.pickup.start}
                            style={{ width: "100%", marginBottom: 10 }}
                            className={classes.txtField}
                            disabled
                          />
                          <TextField
                            id="pickup.end"
                            label="End Date"
                            value={item.pickup.end}
                            style={{ width: "100%", marginBottom: 10 }}
                            className={classes.txtField}
                            disabled
                          />
                        </div>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={6}
                        style={{ backgroundColor: "blue" }}
                      >
                        <LoadScript googleMapsApiKey="AIzaSyB26A_1y8xU5rltpxP1CfE1PwqiA5W3YDs">
                          <GoogleMap
                            mapContainerStyle={{
                              width: "100%",
                              height: "100%",
                            }}
                            // cordinates[index].
                            center={{ lat: cordinates.length === 0 ? 0 : cordinates[index].lat, lng: cordinates.length === 0 ? 0 : cordinates[index].lng }}
                            // center={{ lat: lat, lng: lng }}
                            zoom={10}
                          ></GoogleMap>
                        </LoadScript>

                        {/* {console.log(cordinates)} */}
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} md={6} className={classes.transform}>
                    <Grid
                      container
                      style={{ backgroundColor: "aliceblue", width: "99.5%" }}
                    >
                      <Grid item xs={12} md={6} style={{ padding: 15 }}>
                        <Typography
                          variant="overline"
                          display="block"
                          gutterBottom
                          className={classes.txt}
                        >
                          delivery location
                        </Typography>
                        <div style={{ border: "2px solid", padding: 10 }}>
                          <TextField
                            id="delivery_address.line_1"
                            label="Delivery Address"
                            value={item.delivery_address.line_1}
                            style={{ width: "100%", marginBottom: 10 }}
                            className={classes.txtField}
                            disabled
                          />
                          <TextField
                            id="delivery_address.postal_code"
                            label="Postal Code"
                            value={item.delivery_address.postal_code}
                            style={{ width: "100%", marginBottom: 10 }}
                            className={classes.txtField}
                            disabled
                          />
                          <TextField
                            id="delivery_address.locality"
                            label="Locality"
                            value={item.delivery_address.locality}
                            style={{ width: "100%", marginBottom: 10 }}
                            className={classes.txtField}
                            disabled
                          />
                          <TextField
                            id="delivery_address.administrative_area"
                            label="Are and Country Code"
                            value={
                              item.delivery_address.administrative_area +
                              " - " +
                              item.delivery_address.country_code
                            }
                            style={{ width: "100%", marginBottom: 10 }}
                            className={classes.txtField}
                            disabled
                          />
                        </div>
                        <Typography
                          variant="overline"
                          display="block"
                          gutterBottom
                          className={classes.txt}
                        >
                          delivery date
                        </Typography>
                        <div style={{ border: "2px solid", padding: 10 }}>
                          <TextField
                            id="delivery.start"
                            label="Start Date"
                            value={item.delivery.start}
                            style={{ width: "100%", marginBottom: 10 }}
                            className={classes.txtField}
                            disabled
                          />
                          <TextField
                            id="delivery.end"
                            label="End Date"
                            value={item.delivery.end}
                            style={{ width: "100%", marginBottom: 10 }}
                            className={classes.txtField}
                            disabled
                          />
                        </div>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={6}
                        style={{ backgroundColor: "yellow" }}
                      >
                        <LoadScript googleMapsApiKey="AIzaSyB26A_1y8xU5rltpxP1CfE1PwqiA5W3YDs">
                          <GoogleMap
                            mapContainerStyle={{
                              width: "100%",
                              height: "100%",
                            }}
                            // cordinates[index].
                            center={{ lat: cordinatesDel.length === 0 ? 0 : cordinatesDel[index].lat, lng: cordinatesDel.length === 0 ? 0 : cordinatesDel[index].lng }}
                            // center={{ lat: lat, lng: lng }}
                            zoom={10}
                          ></GoogleMap>
                        </LoadScript>

                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
        ))}
      </Grid>
    );
  }
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      // padding: 5,
      // textAlign: 'center',
      color: "black",
      width: "99.5%",
      borderRadius: 0,
      backgroundColor: "aliceblue",
    },
    root: {
      width: "100%",
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: "33.33%",
      flexShrink: 0,
      color: "white",
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: "black",
      // flexBasis: '50%',
      // flexShrink: 0,
    },
    thirdHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.primary,
      paddingLeft: 10,
    },
    transform: {
      "&:hover": {
        transform: "scale(1.02)",
        transition: "all 0.2s ease-in-out",
      },
    },
    margin: {
      margin: theme.spacing(1),
      width: "100%",
    },
    txt: {
      textAlign: "center",
    },
    txtField: {
      "& .MuiInputBase-root.Mui-disabled": {
        color: "black",
      },
    },
  })
);

export default App;
