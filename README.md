# CCD Diff

Tool to diff CCD changes.

## Usage
```bash
npm start [pathToBaseCCDJson] [pathToBranchCCDJson]
# or with npx
npx -q @hmcts/ccd-diff [pathToBaseCCDJson] [pathToBranchCCDJson]
```

## Output

The only output format supported at the moment is markdown:

### AuthorisationCaseField/APPLICANTTWO.json
<table>
<thead>
  <tr>
    <th>CRUD</th><th>CaseFieldID</th><th>UserRole</th>
  </tr>
</thead>

<tr><td>

```diff
-CRU
```

</td><td>

```diff
-applicant2ConfirmReceipt
```

</td><td>

```diff
-[APPLICANTTWO]
```

</td></tr><tr><td>

```diff
-CRU
```

</td><td>

```diff
-applicant2ContinueApplication
```

</td><td>

```diff
-[APPLICANTTWO]
```

</td></tr><tr><td>

```diff
+CRU
```

</td><td>

```diff
+-Applicant2PrayerFinancialOrdersChild
```

</td><td>

```diff
+[APPLICANTTWO]
```

</td></tr>
<tr><td>

```diff 
-CRU 
+R
```

</td><td>

applicant2Address

</td><td>

[APPLICANTTWO]

</td></tr><tr><td>

```diff 
-CRU 
+R
```

</td><td>

applicant2AgreedToReceiveEmails

</td><td>

[APPLICANTTWO]

</td></tr>
</table>

### AuthorisationCaseField/APPTWOSOLICITOR.json
<table>
<thead>
  <tr>
    <th>CRUD</th><th>CaseFieldID</th><th>UserRole</th>
  </tr>
</thead>

<tr><td>

```diff
-CRU
```

</td><td>

```diff
-applicant2ConfirmReceipt
```

</td><td>

```diff
-[APPTWOSOLICITOR]
```

</td></tr>
</table>


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
          REPORT="$(npx -q @hmcts/ccd-diff build/master build/branch)"
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

