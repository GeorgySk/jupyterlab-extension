FROM jupyter/scipy-notebook
LABEL maintainer="Muhammad Aditya Hilmy <mhilmy@hey.com>"

USER root

RUN apt update \
    && apt install -y gfal2 \
    && apt clean \
    && conda update conda \
    && conda install -y -c conda-forge python-gfal2 \
    && conda clean --all --yes 

COPY . /rucio-jupyterlab
RUN fix-permissions /rucio-jupyterlab
WORKDIR /rucio-jupyterlab

USER $NB_UID

RUN pip install .
RUN jupyter serverextension enable --py rucio_jupyterlab --sys-prefix
RUN jlpm
RUN jlpm build
RUN jupyter labextension link .

ENV JUPYTER_ENABLE_LAB=yes

WORKDIR $HOME
CMD ["/rucio-jupyterlab/docker/configure.sh", "start-notebook.sh"]