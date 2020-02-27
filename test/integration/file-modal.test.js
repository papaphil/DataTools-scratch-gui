import path from 'path';
import SeleniumHelper from '../helpers/selenium-helper';
import { colorPickerInitialState } from '../../src/reducers/color-picker';

const {
    clickText,
    clickButton,
    clickXpath,
    findByText,
    findByXpath,
    getDriver,
    getLogs,
    loadUri
} = new SeleniumHelper();

const uri = path.resolve(__dirname, '../../build/index.html');

let driver;

//Possibly need to create a fixture in order to mimic a file path being entered so that we can fully test

describe('data tools extension popup appearing properly', () =>{
    beforeAll(() => {
        driver = getDriver();
    });

    afterAll(async () => {
        await driver.quit();
    });

    test('Load extension and get popup', async () =>{

        await loadUri(uri);

        await clickXpath('//button[@title="Add Extension"]');

        await clickText('Tools');
        
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for modal to open
        findByText('Upload a local file'); // Scratch Link is mentioned in the error modal

        //for whatever reason checking the logs is causing a timeout error in our code but not any of the other tests
        //when the await is removed it returns an object not any array which throws an error so...
        const logs = await getLogs();
        expect(logs).toEqual([]);  
    });

    test('Adding the Data tools extension and uploading a file via the file temperature menu', async () =>{
        await loadUri(uri);
        
        await clickXpath('//button[@title="Add Extension"]');
        
        await clickText('Tools');

        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for modal to open
        await clickXpath('//div[contains(@class, "close-button_close-button_lOp2G file-modal_closeButton_239MR close-button_large_2oadS")]');

        await clickXpath('//button[@aria-label="Upload Local File"]');
        const input = await findByXpath('//input[@accept=".csv, .xml, .json, application/json"]');
        await input.sendKeys(path.resolve(__dirname, '../fixtures/TEST.json'));
        await clickText('TEST');
        const logs = await getLogs();
        await expect(logs).toEqual([]);
    });

    test('Uploading a file, then viewing it', async () =>{
        await loadUri(uri);
        await clickXpath('//button[@title="Add Extension"]');
        await clickText('Tools');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for modal to open
        await clickXpath('//button[@title="Upload a data file from your computer"]');
        const input = await findByXpath('//input[@accept=".csv,.xml,.json"]');
        await input.sendKeys(path.resolve(__dirname, '../fixtures/TEST.json'));
        const el = await findByXpath('//button[@aria-label="Upload Local File"]');
        await driver.actions().mouseMove(el)
            .perform();
        await driver.sleep(500); // Wait for thermometer menu to come up
        await clickXpath('//button[@aria-label="View Files"]');
        await driver.sleep(1000);
        const logs = await getLogs();
        await expect(logs).toEqual([]);
    });

    //this one will fail right now because we have an issue with the file viewer
    test('Trying to view files when none are uploaded', async () => {
        await loadUri(uri);
        await clickXpath('//button[@title="Add Extension"]');
        await clickText('Tools');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for modal to open
        await clickXpath('//div[contains(@class, "close-button_close-button_lOp2G file-modal_closeButton_239MR close-button_large_2oadS")]');
        const el = await findByXpath('//button[@aria-label="Upload Local File"]');
        await driver.actions().mouseMove(el)
            .perform();
        await driver.sleep(500); // Wait for thermometer menu to come up
        await clickXpath('//button[@aria-label="View Files"]');
        await clickText('Back');//this line fails because we crash when the user clicks the view files. Might fail after fixing and have to change
        const logs = await getLogs();
        await expect(logs).toEqual([]);
    });
});
