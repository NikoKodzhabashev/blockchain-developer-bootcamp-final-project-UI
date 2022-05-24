import { utils } from "ethers/";
import {
  Typography,
  Grid,
  Box,
  CardMedia,
  Card,
  CardContent,
} from "@mui/material";

const Campaign = ({ fundRaise, action }) => {
  return (
    <Grid item xs={4}>
      <Card variant="outlined">
        <CardContent>
          <CardMedia
            component="img"
            height="194"
            image={`https://gateway.pinata.cloud/ipfs/${fundRaise.ipfsHash}`}
          />
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            <Box mr={2} mt={2}>
              Expire in:
            </Box>
            {new Date(parseInt(fundRaise.expireOf._hex)).toDateString()}
          </Typography>
          <Typography variant="h5" component="div">
            {fundRaise.title}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Goal: {parseInt(fundRaise.goal._hex)}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Current amount: {utils.formatEther(fundRaise.currentAmount._hex)}
          </Typography>
          <Typography variant="body2">{fundRaise.description}</Typography>
        </CardContent>
        {action}
      </Card>
    </Grid>
  );
};

export default Campaign;
