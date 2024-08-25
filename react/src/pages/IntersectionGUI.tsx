import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { intersect } from '../clients/Intersect';
import { Alert, Box, Button, CircularProgress, FormControl, FormControlLabel, FormLabel, Paper, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import { IntersectionResponse } from '../clients/models/IntersectionResponse';
import { background1, columnStyle, fillerStyle, leftAlignText, rowStyle } from '../components/styles';
import { ListDisplay } from '../components/ListDisplay';
import nameLogotype from "../../public/nameLogotype.svg"; 
import ListCreatorWebWorker from "../webworker/listCreator?worker";
import { ListCreatorWorkerResponse } from '../webworker/ListCreatorWorkerResponse';

enum ListName {
  A = "A",
  B = "B"
}


function IntersectionGUI({createListsWorker}: {createListsWorker?: Worker}) {

  /**
   * State
   */
  const [lengthListA, setLengthListA] = useState<number|null>(10);
  const [lengthListB, setLengthListB] = useState<number|null>(1000000);
  const [isGeneratingList, setGeneratingList] = useState<boolean>(false);

  const [listA, setListA] = useState<string[]|null>(null);
  const [listB, setListB] = useState<string[]|null>(null);

  const [firstList, setFirstList] = useState<ListName>(ListName.A);

  const [isLoading, setLoading] = useState<boolean>(false);

  const [errorMessage, setErrorMessage] = useState<string|null>(null);
  const [intersectionResponse, setIntersectionResponse] = useState<IntersectionResponse|null>(null);


  /**
   * Reset
   */
  const resetResponse = useCallback(() => {
    setIntersectionResponse(null);
    setErrorMessage(null);
  }, [setIntersectionResponse, setErrorMessage]);

  const clearLists = useCallback(() => {
    resetResponse();
    setListA(null);
    setListB(null);
  }, [setListA, setListB, resetResponse]);

  /**
   * Web worker for creating large lists
   */
  const [listCreator, setListCreator] = useState<null|Worker>(null);
  useEffect(() => {

    const worker = createListsWorker ? createListsWorker : new ListCreatorWebWorker();
    worker.onmessage = (response: MessageEvent<ListCreatorWorkerResponse>) => {
      const {listA, listB} = response.data;
      setListA(listA);
      setListB(listB);
      setGeneratingList(false);
      resetResponse();
    }
    worker.onerror = () => {
      setGeneratingList(false);
      resetResponse();
    }
    worker.onmessageerror = () => {
      setGeneratingList(false);
      resetResponse();
    }
    setListCreator(worker);

    return () => {
      if (!createListsWorker) worker.terminate();
    }
  }, [setListB, setListA, resetResponse, setListCreator, createListsWorker]);


  /**
   * Callbacks
   */
  const onChangeListALength = useCallback((event: FormEvent) => {
    clearLists();
    setLengthListA(parseInt((event?.target as HTMLButtonElement).value));
  }, [setLengthListA, clearLists]);

  const onChangeListBLength = useCallback((event: FormEvent) => {
    clearLists();
    setLengthListB(parseInt((event?.target as HTMLButtonElement).value));
  }, [setLengthListB, clearLists]);

  const onGenerateLists = useCallback(async () => {
    setGeneratingList(true);
    setListA(null);
    setListB(null);
    if (listCreator) listCreator.postMessage({lengthListA, lengthListB});    
  }, [lengthListA, lengthListB, listCreator]);
  
  const onSelectFirstList = useCallback((event: FormEvent) => {
    const value = (event?.target as HTMLInputElement).defaultValue
    setFirstList(value as ListName);
    resetResponse();
  }, [setFirstList, resetResponse]);

  const onClickIntersect = useCallback(async () => {
    resetResponse();
    try {
      setLoading(true);
      let intersection; 
      if (firstList === ListName.A) {
        intersection = await intersect(listA as string[], listB as string[]);
      } else {
        intersection = await intersect(listB as string[], listA as string[]);
      }
      setIntersectionResponse(intersection);
    } catch (error: unknown) {
      setIntersectionResponse(null);
      setErrorMessage((error instanceof Error) ? (error as Error).message : "Could not get data");
    } finally {
      setLoading(false);
    }
  }, [setIntersectionResponse, listA, listB, firstList, resetResponse]);


  /**
   * Estimate query size
   */
  const tooLargeMessage = useMemo(() => {
    const size = new Blob([JSON.stringify({listA, listB})]).size
    return (size > 40000000000) ? "Lists are too large, make them smaller!" : null;
    
  }, [listA, listB])


  /**
   * Render
   */
  const hasTwoNumbers: boolean = typeof(lengthListA) === "number" && typeof(lengthListB) === "number"; 
  
  const hasTwoLists: boolean = !!listA && !!listB;

  const lenghtWarningA = lengthListA !== null ? lengthListA > 1000000 ? "Too large lists might make the app unresponsive" : null : null;
  
  const lenghtWarningB = lengthListB !== null ? lengthListB > 1000000 ? "Too large lists might make the app unresponsive" : null : null;

  return (
    <Box sx={{...columnStyle, ...background1, padding: "40px", width: "100%", height: "100%", boxSizing: "border-box"}}>
      <img style={{width: "500px"}} src={nameLogotype}/>
      <Typography sx={leftAlignText}>
        This tool allows you to caclulate intersections of random lists.
      </Typography>
      <Paper sx={{...columnStyle, width: "1000px"}}>
        
        {/* List setup */}
        <Box sx={{...rowStyle}}>
          <TextField
            inputProps={{ type: 'number'}}
            label="List A Length"
            type="number"
            onChange={onChangeListALength}
            helperText={lenghtWarningA}
            value={lengthListA ? lengthListA : ""}/>
          <TextField 
            label="List B Length"
            inputProps={{ type: 'number'}}
            onChange={onChangeListBLength}
            helperText={lenghtWarningB}
            value={lengthListB ? lengthListB : ""}/>
          <Button disabled={!hasTwoNumbers || isGeneratingList} 
            onClick={onGenerateLists}>
            Generate Lists
          </Button>
        </Box>


        {/* Display lists */}
        { isGeneratingList && <CircularProgress/> }
        { listA && 
          <ListDisplay name="List A" list={listA}/>
        }
        { listB && 
          <ListDisplay name="List B" list={listB}/>
        }
        { tooLargeMessage &&
          <Alert severity='error'>{tooLargeMessage}</Alert>
        }

        {/* Send parameters */}
        { hasTwoLists && !tooLargeMessage && (
            <>
              <Box>
                <FormControl sx={{...rowStyle, alignItems: "center"}}>
                  <FormLabel id="demo-radio-buttons-group-label">First list in call (will be used to populate hash-map):</FormLabel>
                  <RadioGroup sx={rowStyle}
                    aria-labelledby="demo-radio-buttons-group-label"
                    value={firstList}
                    onChange={onSelectFirstList}
                    name="radio-buttons-group"
                  >
                    <FormControlLabel value={ListName.A} control={<Radio />} label="List A" />
                    <FormControlLabel value={ListName.B} control={<Radio />} label="List B" />
                  </RadioGroup>
                </FormControl>
              </Box>
              <Box sx={rowStyle}>
                <Box sx={fillerStyle}/>
                <Button variant="contained"
                  onClick={onClickIntersect}>
                  Calculate Intersection
                </Button>
              </Box>
            </>
          )
        }

        {/* Response */}
        <Box sx={{minHeight: "200px", ...columnStyle}}>
          { isLoading && (
            <CircularProgress/>
          )}
          { !isLoading && hasTwoLists && 
            <>
              {errorMessage && 
                <Alert severity='error'>{errorMessage}</Alert>}
              {intersectionResponse && (
                <>
                  <ListDisplay name="Intersection" list={intersectionResponse.intersection}/>
                  <Typography sx={leftAlignText}>Calculation time: {intersectionResponse.calculationTimeMs}ms</Typography>
                </>
              )}        
            </>
          }
        </Box>
      </Paper>
    </Box>
  )
}

export default IntersectionGUI
