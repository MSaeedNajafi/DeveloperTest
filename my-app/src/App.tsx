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
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

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
            adr_del = result[i].delivery_address.line_1;
            postcode_del = result[i].delivery_address.postal_code;
            local_del = result[i].delivery_address.locality;

            var address_del = adr_del + " " + postcode_del + " " + local_del;
            await Geocode.fromAddress(address_del).then(
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
          setCordinatesDel(cords_del);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, []);

  useEffect(() => {}, [cordinatesDel, cordinates]);

  if (error) {
    return <div className={classes.root}>Error: {error.toString()}</div>;
  } else if (!isLoaded) {
    return <div className={classes.root}>Loading...</div>;
  } else {
    return (
      <Grid container style={{ padding: 20 }}>
        <Grid item xs={12}>
          <Typography variant="h3" gutterBottom style={{ textAlign: "center" }}>
            Transport Jobs
          </Typography>
        </Grid>
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
                    <Grid container className={classes.containerClass}>
                      <Grid item xs={12} md={6} style={{ padding: 15 }}>
                        <Typography
                          variant="overline"
                          display="block"
                          gutterBottom
                          className={classes.txt}
                        >
                          pickup location
                        </Typography>
                        <div className={classes.divClass}>
                          <TextField
                            id="pickup_address.line_1"
                            label="Pickup Address"
                            value={item.pickup_address.line_1}
                            className={classes.txtField}
                            disabled
                          />
                          <TextField
                            id="pickup_address.postal_code"
                            label="Postal Code"
                            value={item.pickup_address.postal_code}
                            className={classes.txtField}
                            disabled
                          />
                          <TextField
                            id="pickup_address.locality"
                            label="Locality"
                            value={item.pickup_address.locality}
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
                        <div className={classes.divClass}>
                          <TextField
                            id="pickup.start"
                            label="Start Date"
                            value={item.pickup.start}
                            className={classes.txtField}
                            disabled
                          />
                          <TextField
                            id="pickup.end"
                            label="End Date"
                            value={item.pickup.end}
                            className={classes.txtField}
                            disabled
                          />
                        </div>
                      </Grid>
                      <Grid item xs={12} md={6} className={classes.map}>
                        <LoadScript googleMapsApiKey="AIzaSyB26A_1y8xU5rltpxP1CfE1PwqiA5W3YDs">
                          <GoogleMap
                            mapContainerStyle={{
                              width: "100%",
                              height: "100%",
                            }}
                            center={{
                              lat:
                                cordinates.length === 0
                                  ? 0
                                  : cordinates[index].lat,
                              lng:
                                cordinates.length === 0
                                  ? 0
                                  : cordinates[index].lng,
                            }}
                            zoom={15}
                          >
                            <Marker
                              key={item.id}
                              position={{
                                lat:
                                  cordinates.length === 0
                                    ? 0
                                    : cordinates[index].lat,
                                lng:
                                  cordinates.length === 0
                                    ? 0
                                    : cordinates[index].lng,
                              }}
                            />
                          </GoogleMap>
                        </LoadScript>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} md={6} className={classes.transform}>
                    <Grid container className={classes.containerClass}>
                      <Grid item xs={12} md={6} style={{ padding: 15 }}>
                        <Typography
                          variant="overline"
                          display="block"
                          gutterBottom
                          className={classes.txt}
                        >
                          delivery location
                        </Typography>
                        <div className={classes.divClass}>
                          <TextField
                            id="delivery_address.line_1"
                            label="Delivery Address"
                            value={item.delivery_address.line_1}
                            className={classes.txtField}
                            disabled
                          />
                          <TextField
                            id="delivery_address.postal_code"
                            label="Postal Code"
                            value={item.delivery_address.postal_code}
                            className={classes.txtField}
                            disabled
                          />
                          <TextField
                            id="delivery_address.locality"
                            label="Locality"
                            value={item.delivery_address.locality}
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
                        <div className={classes.divClass}>
                          <TextField
                            id="delivery.start"
                            label="Start Date"
                            value={item.delivery.start}
                            className={classes.txtField}
                            disabled
                          />
                          <TextField
                            id="delivery.end"
                            label="End Date"
                            value={item.delivery.end}
                            className={classes.txtField}
                            disabled
                          />
                        </div>
                      </Grid>
                      <Grid item xs={12} md={6} className={classes.map}>
                        <LoadScript googleMapsApiKey="AIzaSyB26A_1y8xU5rltpxP1CfE1PwqiA5W3YDs">
                          <GoogleMap
                            mapContainerStyle={{
                              width: "100%",
                              height: "100%",
                            }}
                            center={{
                              lat:
                                cordinatesDel.length === 0
                                  ? 0
                                  : cordinatesDel[index].lat,
                              lng:
                                cordinatesDel.length === 0
                                  ? 0
                                  : cordinatesDel[index].lng,
                            }}
                            zoom={15}
                          >
                            <Marker
                              key={item.id}
                              position={{
                                lat:
                                  cordinatesDel.length === 0
                                    ? 0
                                    : cordinatesDel[index].lat,
                                lng:
                                  cordinatesDel.length === 0
                                    ? 0
                                    : cordinatesDel[index].lng,
                              }}
                            />
                          </GoogleMap>
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
    containerClass: {
      backgroundColor: "aliceblue",
      width: "99.5%",
    },
    divClass: {
      border: "2px solid",
      padding: 10,
    },
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
      fontWeight: "bold",
    },
    txtField: {
      width: "100%",
      marginBottom: 10,
      "& .MuiInputBase-root.Mui-disabled": {
        color: "black",
      },
    },
    map: {
      "@media only screen and (max-width: 1000px)": {
        height: 300,
        // padding: 30
      },
    },
  })
);

export default App;
