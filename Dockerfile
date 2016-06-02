FROM gcr.io/google_appengine/python-compat

RUN apt-get update && apt-get install gfortran -y libopenblas-dev liblapack-dev

RUN pip install -U google-api-python-client

ADD . /app/