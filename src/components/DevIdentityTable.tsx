import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const credentialsData = (role: string, username: string, password: string) => ({
  role,
  username,
  password,
});
const rows = [
  credentialsData("Admin", "Admin", "Password"),
  credentialsData("General", "u1", "12345"),
  credentialsData("General", "u2", "abcde"),
];

export default () => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">Role</TableCell>
            <TableCell align="left">Username&nbsp;(g)</TableCell>
            <TableCell align="left">Password&nbsp;(g)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.username}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="left" component="th" scope="row">
                {row.role}
              </TableCell>
              <TableCell align="left">{row.username}</TableCell>
              <TableCell align="left">{row.password}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
