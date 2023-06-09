import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Collapse, Paper, Stack, Typography } from "@mui/material";
import { Line } from "react-chartjs-2";
import * as React from "react";
import { useContext } from "react";
import { useTheme } from "@mui/material/styles";
import { AppDataContext } from "../context/AppDataContext";
import TerminalGraphEditor from "./FacilityGraphEditor";
import { Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import { processortypes } from "../settings";
import LoSGraph from "./FacilityLoSGraph";
import { AirportIcons } from "../icons/icons";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function App({ processor, options }) {
  const theme = useTheme();
  const data = useContext(AppDataContext);

  const [editing, setEditing] = React.useState(false);
  const halltypes = processortypes
    .filter((obj) => obj.type == "hall")
    .map((obj) => obj.name);

  const isHall = halltypes.includes(data.terminal[processor].type);

  const handleClickEditing = () => {
    setEditing(true);
  };

  const handleClickStopEditing = () => {
    setEditing(false);
  };

  const graphdata = {
    labels: data.simresult[processor].map((row) => row["slot"]),
    datasets: [
      {
        label: "Show-up [Pax/h]",
        data: data.simresult[processor].map((row) =>
          Math.floor(row["Show-up [Pax/h]"])
        ),
        borderColor: theme.palette.info.main,
        backgroundColor: theme.palette.info.main,
        yAxisID: "y",
      },
      {
        label: "Output [Pax/h]",
        data: data.simresult[processor].map((row) =>
          Math.floor(row["Output [Pax/h]"])
        ),
        borderColor: theme.palette.info.light,
        backgroundColor: theme.palette.info.light,
        yAxisID: "y",
      },
      {
        label: isHall ? "Dwell time [min]" : "Queue [min]",
        data: data.simresult[processor].map(
          (row) => Math.floor(row["Queue [min]"] * 10) / 10
        ),
        borderColor: theme.palette.warning.main,
        backgroundColor: theme.palette.warning.main,
        yAxisID: "y1",
        hidden: isHall,
      },
      {
        label: isHall ? "Dwelling Pax [Pax]" : "Queue [Pax]",
        data: data.simresult[processor].map((row) =>
          Math.floor(row["Queue [Pax]"])
        ),
        borderColor: theme.palette.warning.light,
        backgroundColor: theme.palette.warning.light,
        yAxisID: "y",
        hidden: !isHall,
      },
    ],
  };

  if (!isHall)
    graphdata.datasets.push(
      {
        label: "Processor number [n]",
        data: data.terminal[processor]["processor number"],
        borderColor: theme.palette.secondary.main,
        backgroundColor: theme.palette.secondary.main,
        yAxisID: "y1",
        hidden: true,
      },
      {
        label: "processing time [s]",
        data: data.terminal[processor]["processing time [s]"],
        borderColor: theme.palette.secondary.main,
        backgroundColor: theme.palette.secondary.main,
        yAxisID: "y1",
        hidden: true,
      }
    );

  return (
    <Paper sx={{ padding: 1.5 }}>
      <Box
        sx={{
          width: "100%",
          position: "relative",
        }}
      >
        <Typography variant="h6" textAlign="center" sx={{ pt: 0, mt: 0 }}>
          <AirportIcons
            type={data.terminal[processor]["icon"]}
            sx={{ mr: 1 }}
          />
          {data.terminal[processor].name}
        </Typography>
        <Box sx={{ minHeight: "40vh" }}>
          <Line options={options} data={graphdata} />
        </Box>
        <Box>
          <LoSGraph processor={processor} />
        </Box>
        <Box
          sx={{
            width: 45,
            position: "absolute",
            bottom: "-3px",
            right: "0px",
          }}
        >
          {!editing && !isHall && (
            <IconButton
              color="primary"
              size="large"
              aria-label="add an alarm"
              onClick={handleClickEditing}
            >
              <EditIcon fontSize="inherit" />
            </IconButton>
          )}

          <Collapse in={editing}>
            <IconButton
              color="success"
              size="large"
              aria-label="add an alarm"
              onClick={handleClickStopEditing}
            >
              <DoneIcon fontSize="inherit" />
            </IconButton>
          </Collapse>
        </Box>
      </Box>
      <Box>
        <Collapse in={editing}>
          <TerminalGraphEditor processor={processor} />
        </Collapse>
      </Box>
    </Paper>
  );
}
