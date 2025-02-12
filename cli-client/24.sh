se2424 logout
se2424 login --username [your username] --passw [your password]
se2424 healthcheck
se2424 resetpasses
se2424 healthcheck
se2424 resetstations
se2424 healthcheck
se2424 admin --addpasses --source passes24.csv
se2424 healthcheck
se2424 tollstationpasses --station AM08 --from 20220121 --to 20220204 --format json
se2424 tollstationpasses --station NAO04 --from 20220121 --to 20220204 --format csv
se2424 tollstationpasses --station NO01 --from 20220121 --to 20220204 --format csv
se2424 tollstationpasses --station OO03 --from 20220121 --to 20220204 --format csv
se2424 tollstationpasses --station XXX --from 20220121 --to 20220204 --format csv
se2424 tollstationpasses --station OO03 --from 20220121 --to 20220204 --format YYY
se2424 errorparam --station OO03 --from 20220121 --to 20220204 --format csv
se2424 tollstationpasses --station AM08 --from 20220122 --to 20220202 --format json
se2424 tollstationpasses --station NAO04 --from 20220122 --to 20220202 --format csv
se2424 tollstationpasses --station NO01 --from 20220122 --to 20220202 --format csv
se2424 tollstationpasses --station OO03 --from 20220122 --to 20220202 --format csv
se2424 tollstationpasses --station XXX --from 20220122 --to 20220202 --format csv
se2424 tollstationpasses --station OO03 --from 20220122 --to 20220202 --format YYY
se2424 passanalysis --stationop AM --tagop NAO --from 20220121 --to 20220204 --format json
se2424 passanalysis --stationop NAO --tagop AM --from 20220121 --to 20220204 --format csv
se2424 passanalysis --stationop NO --tagop OO --from 20220121 --to 20220204 --format csv
se2424 passanalysis --stationop OO --tagop KO --from 20220121 --to 20220204 --format csv
se2424 passanalysis --stationop XXX --tagop KO --from 20220121 --to 20220204 --format csv
se2424 passanalysis --stationop AM --tagop NAO --from 20220122 --to 20220202 --format json
se2424 passanalysis --stationop NAO --tagop AM --from 20220122 --to 20220202 --format csv
se2424 passanalysis --stationop NO --tagop OO --from 20220122 --to 20220202 --format csv
se2424 passanalysis --stationop OO --tagop KO --from 20220122 --to 20220202 --format csv
se2424 passanalysis --stationop XXX --tagop KO --from 20220122 --to 20220202 --format csv
se2424 passescost --stationop AM --tagop NAO --from 20220121 --to 20220204 --format json
se2424 passescost --stationop NAO --tagop AM --from 20220121 --to 20220204 --format csv
se2424 passescost --stationop NO --tagop OO --from 20220121 --to 20220204 --format csv
se2424 passescost --stationop OO --tagop KO --from 20220121 --to 20220204 --format csv
se2424 passescost --stationop XXX --tagop KO --from 20220121 --to 20220204 --format csv
se2424 passescost --stationop AM --tagop NAO --from 20220122 --to 20220202 --format json
se2424 passescost --stationop NAO --tagop AM --from 20220122 --to 20220202 --format csv
se2424 passescost --stationop NO --tagop OO --from 20220122 --to 20220202 --format csv
se2424 passescost --stationop OO --tagop KO --from 20220122 --to 20220202 --format csv
se2424 passescost --stationop XXX --tagop KO --from 20220122 --to 20220202 --format csv
se2424 chargesby --opid NAO --from 20220121 --to 20220204 --format json
se2424 chargesby --opid GE --from 20220121 --to 20220204 --format csv
se2424 chargesby --opid OO --from 20220121 --to 20220204 --format csv
se2424 chargesby --opid KO --from 20220121 --to 20220204 --format csv
se2424 chargesby --opid NO --from 20220121 --to 20220204 --format csv
se2424 chargesby --opid NAO --from 20220122 --to 20220202 --format json
se2424 chargesby --opid GE --from 20220122 --to 20220202 --format csv
se2424 chargesby --opid OO --from 20220122 --to 20220202 --format csv
se2424 chargesby --opid KO --from 20220122 --to 20220202 --format csv
se2424 chargesby --opid NO --from 20220122 --to 20220202 --format csv
