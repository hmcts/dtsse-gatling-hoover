# CCD Diff

Tool to diff CCD changes.

## Usage
```bash
npm start [pathToBaseCCDJson] [pathToBranchCCDJson]
```

## Output

The only output format supported at the moment is markdown:

### AuthorisationCaseState.json


#### 2 removed
|CRUD|CaseStateID|UserRole|
|---|---|---|
|CRUD|Rejected|caseworker-divorce-systemupdate|
|CRUD|Withdrawn|caseworker-divorce-systemupdate|


#### 1 changed
<table>
<thead>
  <tr>
    <th>CRUD</th><th>CaseStateID</th><th>UserRole</th>
  </tr>
</thead>
<tr><td>

```diff 
-CRU 
+CRUD
```

</td><td>

AosDrafted

</td><td>

caseworker-divorce-courtadmin-la

</td></tr>
</table>

### CaseField.json

#### 1 added
|FieldType|ID|Label|
|---|---|---|
|DateAndHour|dateAndHour|Date and hour?|


#### 1 removed
|FieldType|ID|Label|
|---|---|---|
|DivorceDocument|coConditionalOrderGrantedDocument|Conditional Order Granted|

## Use on PRs

You can add a report to a PR with CCD changes by adding:

```yaml

  report:
    runs-on: ubuntu-latest
    needs: [buildBranch, buildMaster]
    steps:
      - uses: actions/setup-node@v3
        with:
          node-version: 16
      - uses: actions/download-artifact@v3
        with:
          name: branch
          path: build/branch
      - uses: actions/download-artifact@v3
        with:
          name: master
          path: build/master
      - name: Generate report
        id: ccd-diff
        run: |
          REPORT="$(npx --silent @hmcts/ccd-diff build/master build/branch)"
          REPORT="${REPORT//'%'/'%25'}"
          REPORT="${REPORT//$'\n'/'%0A'}"
          REPORT="${REPORT//$'\r'/'%0D'}"
          echo $REPORT
          echo "::set-output name=content::$REPORT"
      - name: Display
        run: |
          echo "${{ steps.ccd-diff.outputs.content }}"
      - name: Add report
        uses: thollander/actions-comment-pull-request@v1
        with:
          message: |
            # CCD diff report ${{ steps.ccd-diff.outputs.content }}
          comment_includes: CCD diff report
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

You will need to add two steps to upload the CCD JSON definition artifacts to compare. For a CCD config generator based config this would look like:

```yaml
  setup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/setup-java@v3
        with:
          distribution: corretto
          java-version: 17

  buildBranch:
    runs-on: ubuntu-latest
    needs: [setup]
    steps:
      - uses: actions/checkout@v3
        with:
          path: build/branch
      - name: Build
        run: ./gradlew generateCCDConfig
        working-directory: build/branch
      - uses: actions/upload-artifact@v3
        with:
          name: branch
          path: build/branch/build/definitions/NFD

  buildMaster:
    runs-on: ubuntu-latest
    needs: [setup]
    steps:
      - uses: actions/checkout@v3
        with:
          ref: master
          path: build/master
      - name: Build
        run: ./gradlew generateCCDConfig
        working-directory: build/master
      - uses: actions/upload-artifact@v3
        with:
          name: master
          path: build/master/build/definitions/NFD
```

For a plain JSON repository this would look like:

```yaml
  buildBranch:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          path: build/branch
      - uses: actions/upload-artifact@v3
        with:
          name: branch
          path: build/branch/definitions/divorce/json

  buildMaster:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          ref: master
          path: build/master
      - uses: actions/upload-artifact@v3
        with:
          name: master
          path: build/master/definitions/divorce/json
```

