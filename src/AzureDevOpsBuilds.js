import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CssVarsProvider } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import { Autocomplete, Chip,Container } from "@mui/joy"
import Input from '@mui/joy/Input';
import Card from '@mui/joy/Card';
import '@fontsource/inter';
import StepProgressBar from './StepProgressBar';

const AzureDevOpsBuilds = () => {
  const [buildIds, setBuildIds] = useState([]);
  const [filteredStage, setFilteredStage] = useState(['test','test2']);
  const [buildsData, setBuildsData] = useState([]);
  const [pat, setPat] = useState('');
  const [url, setUrl] = useState('');

  const handleBuildIdsChange = (event) => {
    setBuildIds(buildIds => [...buildIds, event.target.value] );
  };
  const handlePat = (event) => {
    setPat(event.target.value);
  };

  const handleUrl = (event) => {
    setUrl(event.target.value);
  };

  // const handleFilter = (stage) => {
  //   console.log(stage);
  //   const index = filteredStage.indexOf(stage);
  //   if( index === -1 ){
  //     filteredStage.push(stage);
  //   }
  //   else {
  //     //filteredStage.splice(index,1);
  //   }
  //   setFilteredStage(filteredStage);
  // };

  const fetchBuildsData = async () => {
    const buildIdsArray = buildIds.filter(id => id.trim() !== '');

    const requestOptions = {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${btoa(`:${pat}`)}`
      }
    };

    const buildPromises = buildIdsArray.map(async id => {
      try {
        const response = await fetch(`${url}/_apis/build/builds/${id}/timeline?api-version=6.0`, requestOptions);

        if (!response.ok) {
          throw new Error('Erreur réseau ou réponse non valide');
        }

        const data = await response.json();
        const stageRecords = data.records.filter(record => record.type === 'Stage');
        const stagesWithBuildId = stageRecords.map(stage => (
            { 
              name: stage.identifier,
              status: stage.state,
              result : stage.result,
              order : stage.order 
            }
        ));
        
        stagesWithBuildId.map(stage => {
            if( filteredStage.indexOf(stage.name) === -1 ) { 
                filteredStage.push(stage.name); 
                setFilteredStage([stage.name])
            }
            return filteredStage;
        });

        return { buildId: id, stages: stagesWithBuildId };
      } catch (error) {
        console.error(`Erreur lors de la récupération des stages pour le build ID ${id} :`, error);
        return { buildId: id, stages: [] };
      }
    });

    try {
      const buildsData = await Promise.all(buildPromises);
      setBuildsData(buildsData);
    } catch (error) {
      console.error('Erreur lors de la récupération des données des builds :', error);
    }
  };

  // useEffect(() => {

  // }, []); 

  return (
    <div className="container mt-4">
      <Container sx={{ "width" : "70%" }} >
      <CssVarsProvider>
      <Sheet variant="plain">
        <Card >
        <FormControl>
          <FormLabel>Url</FormLabel>
          <Input
            // html input attribute
            name="url"
            type="text"
            placeholder="Put your url here.eg: https://dev.azuredevops.com/Organization/Project"
            onChange={handleUrl} 
            value={url} 
          />
        </FormControl>
        <FormControl>
          <FormLabel>Your pat</FormLabel>
          <Input
            name="pat"
            type="password"
            placeholder="Put your pat here"
            onChange={handlePat} 
            value={pat}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Build IDs (press enter to validate) :</FormLabel>
          <Autocomplete
            clearIcon={false}
            options={[]}
            sx={{ height : "5lh" }}
            freeSolo
            multiple
            value={buildIds}
            onChange={handleBuildIdsChange}
            renderTags={(value, props) =>
              value.map((option, index) => (
                <Chip label={option} {...props({ index })} >{option}</Chip>
              ))
            }
        />
        </FormControl>
        {/* <div className=''> 
          {filteredStage.map( build => (<>
              <Filter stages={build.stages} onChange={handleFilter}></Filter>
            </>
          ))}
        </div> */}
        <button
          type="button"
          className="btn btn-primary"
          onClick={fetchBuildsData}
        >
          Afficher l'état des Stages
        </button>
        </Card>
      </Sheet>
      </CssVarsProvider>
      </Container>
      <Container sx={{  }}>
      <div className="mt-4">
        {buildsData.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Build ID</th>
                <th>Stages</th>
              </tr>
            </thead>
            <tbody>
              {buildsData.map(build => (
                
                <tr key={build.buildId}>
                  <td>{build.buildId}</td>
                  {/* <td><h6><span class="badge bg-secondary">Parameters</span></h6></td> */}
                  <td>
                  <div>
                      <StepProgressBar stages={build.stages} ></StepProgressBar>
                  </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Aucune donnée de build à afficher pour le moment.</p>
        )}
      </div>
      </Container>
    </div>
  );
};

export default AzureDevOpsBuilds;
