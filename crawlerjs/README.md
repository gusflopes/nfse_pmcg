## Install Selenium

```bash
# Just run the script
./install-selenium

# And then install tesseract
sudo apt install tesseract-ocr
```

## Testar
`npm run gcp-build`

## Deploy GCLOUD
Falta testar, mas supostamente é isso.

```bash
gcloud functions deploy datalayer-test --memory=1024M --gen2 --runtime=nodejs16  --source=. --entry-point=hello --trigger-http --allow-unauthenticated
```
