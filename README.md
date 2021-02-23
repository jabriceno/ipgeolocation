# Localizador de Direcciones IP

<!--- These are examples. See https://shields.io for others or to customize this set of shields. You might want to include dependencies, project status and licence info here --->
![GitHub repo size](https://img.shields.io/github/repo-size/jabriceno/ipgeolocalization)

Esta herramienta tiene por propósito determinar y almacenar informacion sobre el país origen de una dirección ip provista, para ello consulta a traves de distintos servicios de API para obtener la informacion a almacenar.

## Prerequisitos

Antes de utilizar esta herramienta, asegurese de cumplir con los siguientes requerimientos:
* Contar con una instalación de [Docker](https://docs.docker.com/engine/install/).
* Acceso a una terminal de línea de comandos.
* Puede ser de utilidad poseer direcciones ip para suministrar.

## Instalación

1. Clone el repositorio del proyecto:
```
git clone https://github.com/jabriceno/ipgeolocation.git
```
2. Ingrese a la carpeta del proyecto:
```
cd ipgeolocation
```
3. Construya el contenedor docker:
```
docker-compose build
```
4. Inicie el contenedor:
```
docker-compose up -d
```

## Uso
### Funcionalidad 1: Analizar direccion IP
1. Ingrese al contenedor docker con:

```
docker exec -it ipgeolocation_server_1 bash
```
2. Una vez dentro del contenedor, puede analizar una dirección ip ejecutando el comando:
```
npm run getIpInfo <ip>
```
> Direcciones IP de ejemplo
>| IP | País |
>| :---: | :---: |
>| 185.188.61.6    | reino unido |
>| 188.208.141.35  | españa |
>| 45.248.79.30    | australia |
>| 202.102.42.210  | china |
>| 103.94.27.102   | india |
>| 154.127.49.227  | sudafrica |
>| 200.202.100.90  | brasil |
>| 191.96.73.233   | usa |

3. Para procesar un lote de direcciones ip para su análisis ejecute:
```
npm run seed <cantidad> 
```
> El param `<cantidad>` es opcional, si no se suministra se generaran 1000 direcciones ip

### Funcionalidad 2: Estadisticas de trafico
Abra una ventana del navegador para consultar las estadisticas de utlización:
* Para ver la distancia más lejana a Buenos Aires desde la cual se ha consultado el servicio: <http://localhost:4000/distance/farthest>
* Para ver la distancia más cercana a Buenos Aires desde la cual se ha consultado: <http://localhost:4000/distance/nearest>
* Para ver la distancia promedio de todas las ejecuciones que se hayan hecho del servicio: <http://localhost:4000/distance/average>

## Contacto

<jesusbg71@gmail.com>.
