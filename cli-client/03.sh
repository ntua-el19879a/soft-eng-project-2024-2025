se2403 logout
se2403 login --username admin --passw freepasses4all
se2403 healthcheck
se2403 resetpasses
se2403 healthcheck
se2403 resetstations --file ../back-end/uploads/tollstations2024.csv
se2403 healthcheck
se2403 admin --addpasses --source ./passes03.csv
se2403 healthcheck
se2403 tollstationpasses --station AM08 --from 20220117 --to 20220131 --format json
se2403 tollstationpasses --station NAO04 --from 20220117 --to 20220131 --format csv
se2403 tollstationpasses --station NO01 --from 20220117 --to 20220131 --format csv
se2403 tollstationpasses --station OO03 --from 20220117 --to 20220131 --format csv
se2403 tollstationpasses --station XXX --from 20220117 --to 20220131 --format csv
se2403 tollstationpasses --station OO03 --from 20220117 --to 20220131 --format YYY
se2403 errorparam --station OO03 --from 20220117 --to 20220131 --format csv
se2403 tollstationpasses --station AM08 --from 20220118 --to 20220129 --format json
se2403 tollstationpasses --station NAO04 --from 20220118 --to 20220129 --format csv
se2403 tollstationpasses --station NO01 --from 20220118 --to 20220129 --format csv
se2403 tollstationpasses --station OO03 --from 20220118 --to 20220129 --format csv
se2403 tollstationpasses --station XXX --from 20220118 --to 20220129 --format csv
se2403 tollstationpasses --station OO03 --from 20220118 --to 20220129 --format YYY
se2403 passanalysis --stationop AM --tagop NAO --from 20220117 --to 20220131 --format json
se2403 passanalysis --stationop NAO --tagop AM --from 20220117 --to 20220131 --format csv
se2403 passanalysis --stationop NO --tagop OO --from 20220117 --to 20220131 --format csv
se2403 passanalysis --stationop OO --tagop KO --from 20220117 --to 20220131 --format csv
se2403 passanalysis --stationop XXX --tagop KO --from 20220117 --to 20220131 --format csv
se2403 passanalysis --stationop AM --tagop NAO --from 20220118 --to 20220129 --format json
se2403 passanalysis --stationop NAO --tagop AM --from 20220118 --to 20220129 --format csv
se2403 passanalysis --stationop NO --tagop OO --from 20220118 --to 20220129 --format csv
se2403 passanalysis --stationop OO --tagop KO --from 20220118 --to 20220129 --format csv
se2403 passanalysis --stationop XXX --tagop KO --from 20220118 --to 20220129 --format csv
se2403 passescost --stationop AM --tagop NAO --from 20220117 --to 20220131 --format json
se2403 passescost --stationop NAO --tagop AM --from 20220117 --to 20220131 --format csv
se2403 passescost --stationop NO --tagop OO --from 20220117 --to 20220131 --format csv
se2403 passescost --stationop OO --tagop KO --from 20220117 --to 20220131 --format csv
se2403 passescost --stationop XXX --tagop KO --from 20220117 --to 20220131 --format csv
se2403 passescost --stationop AM --tagop NAO --from 20220118 --to 20220129 --format json
se2403 passescost --stationop NAO --tagop AM --from 20220118 --to 20220129 --format csv
se2403 passescost --stationop NO --tagop OO --from 20220118 --to 20220129 --format csv
se2403 passescost --stationop OO --tagop KO --from 20220118 --to 20220129 --format csv
se2403 passescost --stationop XXX --tagop KO --from 20220118 --to 20220129 --format csv
se2403 chargesby --opid NAO --from 20220117 --to 20220131 --format json
se2403 chargesby --opid GE --from 20220117 --to 20220131 --format csv
se2403 chargesby --opid OO --from 20220117 --to 20220131 --format csv
se2403 chargesby --opid KO --from 20220117 --to 20220131 --format csv
se2403 chargesby --opid NO --from 20220117 --to 20220131 --format csv
se2403 chargesby --opid NAO --from 20220118 --to 20220129 --format json
se2403 chargesby --opid GE --from 20220118 --to 20220129 --format csv
se2403 chargesby --opid OO --from 20220118 --to 20220129 --format csv
se2403 chargesby --opid KO --from 20220118 --to 20220129 --format csv
se2403 chargesby --opid NO --from 20220118 --to 20220129 --format csv
