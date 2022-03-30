FROM python:3

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONBUFFERED 1

# create directory for the app user
RUN mkdir -p /home/admin

RUN addgroup --system admin && adduser --system --group admin

ENV HOME=/home/admin
ENV APP_HOME=/home/admin/web
RUN mkdir $APP_HOME
RUN mkdir $APP_HOME/static
WORKDIR $APP_HOME

RUN apt-get update && apt-get -y dist-upgrade
RUN apt-get install -y ncat
RUN python -m pip install --upgrade pip
COPY ./requirements.txt .
RUN python -m pip install -r requirements.txt

EXPOSE 8080
# copy project
COPY . $APP_HOME

RUN chown -R admin:admin $APP_HOME

USER admin
