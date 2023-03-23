## OBS

```bash
gcloud functions deploy datalayer-test --memory=1024M --gen2 --runtime=nodejs16  --source=. --entry-point=hello --trigger-http --allow-unauthenticated
```
