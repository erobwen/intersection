import { FormEvent, useCallback, useState } from 'react';
import './IntersectionGUI.css'
import { intersect } from '../clients/Intersect';
import { generateRandomList } from '../components/randomListGenerator';
import { Alert, Button, Paper, TextField, Typography } from "@mui/material";
import { IntersectionResponse } from '../clients/models/IntersectionResponse';

const columnStyle = {display: "flex", flexDirection: "column", gap: "10px", padding: "10px"}
const rowStyle = {display: "flex", flexDirection: "row", gap: "10px", padding: "10px"}

function IntersectionGUI() {
  const [errorMessage, setErrorMessage] = useState<string|null>(null);

  const [listA, setListA] = useState<string[]>([]);
  const [listB, setListB] = useState<string[]>([]);
  const [intersectionResponse, setIntersectionResponse] = useState<IntersectionResponse|null>(null);

  const [lengthListA, setLengthListA] = useState<number|null>(1000);
  const [lengthListB, setLengthListB] = useState<number|null>(1000);

  const onChangeListALength = useCallback((event: FormEvent) => {
    console.log(event);
    console.log(event?.target);
    console.log((event?.target as HTMLButtonElement).value);
    console.log(parseInt((event?.target as HTMLButtonElement).value));
    setLengthListA(parseInt((event?.target as HTMLButtonElement).value));
  }, [setLengthListA]);

  const onChangeListBLength = useCallback((event: FormEvent) => {
    setLengthListB(parseInt((event?.target as HTMLButtonElement).value));
  }, [setLengthListB]);

  const onGenerateLists = useCallback(() => {
    setListA(generateRandomList(lengthListA as number));
    setListB(generateRandomList(lengthListB as number));
    setIntersectionResponse(null);
  }, [setListB, setListA, lengthListA, lengthListB]);
  
  const onClickIntersect = useCallback(async () => {
    try {
      const intersection = await intersect(listA, listB);
      console.log(intersection);
      setIntersectionResponse(intersection);
    } catch (error: any) {
      setIntersectionResponse(null);
      setErrorMessage(error.message);
    }
  }, [setIntersectionResponse, listA, listB]);

  const hasTwoNumbers: boolean = typeof(lengthListA) === "number" && typeof(lengthListB) === "number"; 
  
  const hasTwoNonEmptyLists: boolean = listA.length > 0 && listB.length > 0

  console.log("lengthListA:")
  console.log(lengthListA);

  return (
    <>
      <h1>Intersection Tool</h1>
      <p>
        This tool allows you to caclulate intersections of random lists.
      </p>
      <Paper sx={columnStyle}>
        <Paper sx={rowStyle}>
          <TextField
            inputProps={{ type: 'number'}}
            label="List A Length"
            type="number"
            onChange={onChangeListALength}
            value={lengthListA ? lengthListA : ""}/>
          <TextField 
            label="List B Length"
            inputProps={{ type: 'number'}}
            onChange={onChangeListBLength}
            value={lengthListB ? lengthListB : ""}/>
          <Button disabled={!hasTwoNumbers} 
            onClick={onGenerateLists}>
            Generate Lists
          </Button>
        </Paper>
        <Paper>
          <h3>List A</h3>
          <div>{`[${listA.join(", ")}]`}</div>
        </Paper>
        <Paper>
          <h3>List B</h3>
          <div>{`[${listB.join(", ")}]`}</div>
        </Paper>
        <Button disabled={!hasTwoNonEmptyLists} 
            onClick={onClickIntersect}>
            Calculate Intersection!
        </Button>
        {errorMessage && 
          <Alert severity='error'>{errorMessage}</Alert>}
        {intersectionResponse && (
          <Paper>
            <h3>Intersection</h3>
            <Typography>{`[${intersectionResponse.intersection.join(", ")}]`}</Typography>
            <Typography>Time in MS: {intersectionResponse.calculationTimeMs}</Typography>
          </Paper>
        )}
      </Paper>
    </>
  )
}

export default IntersectionGUI
